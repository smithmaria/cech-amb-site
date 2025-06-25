import ProfileIcon from "../../../components/ProfileIcon";

const UsersTable = ({ users, filter, selectedUsers, setSelectedUsers }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(new Set (users.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };
  
  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }

    setSelectedUsers(newSelected);
  };

  const isAllSelected = users.length > 0 && selectedUsers.size === users.length;

  return (
    <div className="users-table-container">
      <table className='table users-table'>
        <thead>
          <tr className='table-header' style={{textWrap: 'nowrap'}}>
            <th className="checkbox-wrapper" style={{width: '40px'}}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th>Profile</th>
            <th>Full Name</th>
            {filter === 'pending' ? 
              <th>Admin</th>
              : null
            }
            {filter !== 'members' ? 
              <th>Position</th>
              : null
            }
            <th>Email</th>
            <th>General Major</th>
            <th>Official Major</th>
            <th>Minor</th>
            <th>Grad Year</th>
            <th>Certs</th>
            <th>Orgs</th>
            <th>Experience</th>
          </tr>
        </thead>
          
          {users.length > 0 
            ? users.map(user => (
              <tbody>
              <tr 
                key={user.id} 
                className={`table-row users-row ${selectedUsers.has(user.id) ? 'selected-row' : ''}`}
              >
                <td className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>
                  <ProfileIcon 
                    src={user.profilePictureURL} 
                  />
                </td>
                <td>{user.firstName} {user.lastName}</td>
                {filter === 'pending' ? 
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                : null
                }
                {filter !== 'members' ? 
                  <td>{user.position}</td>
                : null
                }
                <td>{user.email}</td>
                <td>{user.generalMajor?.join(', ')}</td>
                <td>{user.specificMajors?.join(', ')}</td>
                <td>{user.minor}</td>
                <td>{user.gradYear}</td>
                <td>{user.certs}</td>
                <td>{user.orgs}</td>
                <td>{user.experience}</td>
              </tr>
              </tbody>
            ))
        : null
        }
      </table>
      {users.length === 0 
        ? <div className='no-events'>No users to show</div>
        : null
      }
    </div>
  );
};

export default UsersTable;
