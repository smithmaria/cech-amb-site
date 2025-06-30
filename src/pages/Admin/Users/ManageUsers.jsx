import { MdOutlineChat, MdOutlineDelete, MdOutlineFileDownloadDone, MdOutlinePersonOff } from "react-icons/md";
import { useEffect, useState } from "react";
import UsersTable from "./UsersTable";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import MessageModal from "./MessageModal";
import UsersConfirmationModal from "./UsersConfirmationModal";
import Loading from "../../../components/Loading";

const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION || 'users';

const ManageUsers = () => {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('members');

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalConfirm, setModalConfirm] = useState();

  const [actionLoading, setActionLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const { currentUser } = useAuth();

  const filters = [
    { id: 'members', label: 'Members' },
    { id: 'admins', label: 'Admins' },
    { id: 'pending', label: 'Pending' }
  ];

  const pendingCount = users.filter(user => !user.isApproved).length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(usersRef, orderBy('lastName', 'asc'));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    switch (activeFilter) {
      case 'members':
        return !user.isAdmin && user.isApproved;
      case 'admins':
        return user.isAdmin && user.isApproved;
      case 'pending':
        return !user.isApproved;
      default: 
        return true;
    }
  });

  const functions = getFunctions();
  const deleteUsers = httpsCallable(functions, "deleteUsers");

  const handleDeleteSelected = async () => {
    setActionLoading(true);

    if (!currentUser.isAdmin) {
      toast.error('Must be an admin to delete users.');
      setActionLoading(false);
      return;
    } 

    if (selectedUsers.has(currentUser.uid)) {
      toast.error('Unable to delete your own account. Please ask another admin to remove your account if needed.');
      setActionLoading(false);
      return;
    }

    try {
      const userIds = Array.from(selectedUsers);
      const result = await deleteUsers({userIds});        // Expects an object, this will be userIds: [still an array]

      toast.success(`Successfully deleted ${selectedUsers.size} ${selectedUsers.size === 1 ? 'user' : 'users'}`);

      setUsers(users.filter(user => !selectedUsers.has(user.id)));

      setEmailSubject('Account Denied');
      setEmailBody(
        `Unfortunately, we were not able to approve your account for CECH Ambassadors. Accounts are limited to current members and staff in our organization. If you believe this was a mistake, feel free to reach out and let us know.\n\nBest regards,\nCECH Ambassadors Team`
      );
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error('Error deleting users. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSelected = async () => {
    setActionLoading(true);

    if (!currentUser.isAdmin) {
      toast.error('Must be an admin to approve users.');
      setActionLoading(false);
      return;
    }

    try {
      const updatePromises = Array.from(selectedUsers).map(userId => {
        updateDoc(doc(db, USERS_COLLECTION, userId), {
          isApproved: true
        })
      });

      await Promise.all(updatePromises);

      setUsers(users.map(user => 
        selectedUsers.has(user.id)
        ? { ...user, isApproved: true }
        : user
      ));

      toast.success(`Successfully approved ${selectedUsers.size} ${selectedUsers.size === 1 ? 'user' : 'users'}`);

      setEmailSubject('Account Approved');
      setEmailBody(
        `Congratulations!\n\nYour account has been approved and you should now be able to sign up for events and show up on our members tab.\n\nThanks for creating an account!\n\nBest regards,\nCECH Ambassadors Team`
      );
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error approving users:', error);
      toast.error('Error approving users. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseMessageModal = () => {
    if (activeFilter === 'pending') {
      setSelectedUsers(new Set());
    }

    setShowMessageModal(false);
  };

  return (
    <div style={{paddingTop: '1rem'}}>
      {actionLoading 
      ? <div className="modal-overlay">
        <Loading /> 
      </div>
      : null}
      <div className="users-header">
        <h2>Users</h2>
          {selectedUsers.size > 0 && activeFilter !== 'pending' ? (
            <div className="selected-actions">
              <div>{selectedUsers.size} selected</div>
              <MdOutlineChat 
                size={26}
                className="selected-action"
                onClick={() => {
                  setEmailSubject('');
                  setEmailBody('');
                  setShowMessageModal(true)
                }}
                title="Message"
              />
              <MdOutlineDelete 
                size={26}
                className="selected-action"
                onClick={() => {
                  setModalTitle(selectedUsers.size === 1 ? 
                    "Are you sure you want to delete this user?"
                     : 
                    "Are you sure you want to delete these users?"
                  );
                  setModalConfirm(() => handleDeleteSelected);
                  setShowConfirmationModal(true);
                }}
                title="Delete"
              />

            </div> 
          ) : selectedUsers.size > 0 && activeFilter === 'pending' ? (
            <div className="selected-actions-pending">
              <div>{selectedUsers.size} selected</div>
              <div 
                className="message-user"
                onClick={() => {
                  setEmailSubject('');
                  setEmailBody('');
                  setShowMessageModal(true)
                }}  
              >
                <MdOutlineChat size={26} />
                <span>Message</span>
              </div>
              <div 
                className="approve-user"
                onClick={() => {
                  setModalTitle('Are you sure you want to approve these users?');
                  setModalConfirm(() => handleApproveSelected);
                  setShowConfirmationModal(true);
                }}  
              >
                <MdOutlineFileDownloadDone size={26} />
                <span>Approve</span>
              </div>
              <div 
                className="deny-user" 
                onClick={() => {
                  setModalTitle('Are you sure you want to delete these users?');
                  setModalConfirm(() => handleDeleteSelected);
                  setShowConfirmationModal(true);
                }}
              >
                <MdOutlinePersonOff size={28}/>
                <span>Deny</span>
              </div>
            </div> 
          ) : ( 
            <div className="users-filters">
              {filters.map((filter) => (
              <div
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`users-filter ${activeFilter === filter.id ? 'users-filter-active' : ''}`}
              >
                {filter.label}
                {filter.id === 'pending' && pendingCount > 0
                  ? <span className="pending-count">{pendingCount}</span>
                  : null
                }
              </div>
              ))}
            </div>
          )}
      </div>


      {loading ? 
        <Loading /> :
        <UsersTable 
          users={filteredUsers}
          filter={activeFilter}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      }

      <MessageModal 
        isOpen={showMessageModal}
        onClose={handleCloseMessageModal}
        users={users}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        emailSubject={emailSubject}
        emailBody={emailBody}
      />

      <UsersConfirmationModal 
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title={modalTitle}
        onConfirm={modalConfirm}
        users={users}
        setUsers={setUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      
      <Toaster position="bottom-center" />
    </div>
  );
};

export default ManageUsers;
