import React, { useState } from 'react';
import './LogIn.css';
import { MdArrowBack, MdOutlineBadge, MdOutlineGroup } from "react-icons/md";
import { createUserAccount } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import ProfileIcon from '../../components/ProfileIcon';
import { uploadProfilePicture } from '../../services/storageService';

function CreateAccount() {
  const [accountType, setAccountType] = useState(null); // 'admin' or 'member'
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const navigate = useNavigate();

    const [formData, setFormData] = useState({
    // Personal info
    firstName: '',
    lastName: '',
    email: '',
    isExec: false,
    position: '',
    
    // Academic info (member only)
    generalMajor: [],
    specificMajors: [''],
    minor: '',
    gradYear: '',
    orgs: '',
    
    // Experience (member only)
    hasWorkExperience: null,
    experience: '',
    hasCertificates: null,
    certs: '',
    
    // Password
    password: '',
    confirmPassword: ''
  });

  const adminSteps = [
    { id: 'personal', title: 'Personal Information', description: 'Basic details' },
    { id: 'password', title: 'Set Password', description: 'Account security' },
    { id: 'review', title: 'Review & Submit', description: 'Confirm details' }
  ];

  const memberSteps = [
    { id: 'personal', title: 'Personal Information', description: 'Basic details' },
    { id: 'academic', title: 'Academic Information', description: 'Education details' },
    { id: 'experience', title: 'Experience', description: 'Work & certificates' },
    { id: 'password', title: 'Set Password', description: 'Account security' },
    { id: 'review', title: 'Review & Submit', description: 'Confirm details' }
  ];

  const steps = accountType === 'admin' ? adminSteps : memberSteps;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (file, previewURL) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: file,
      profilePictureURL: previewURL
    }));
    setImageUploadError(null);
  };
  
  const handleImageRemove = () => {
    if (formData.profilePictureURL && formData.profilePictureURL.startsWith('blob:')) {
      URL.revokeObjectURL(formData.profilePictureURL);
    }
    
    setFormData(prev => ({
      ...prev,
      profilePicture: null,
      profilePictureURL: '',
      profilePicturePath: ''
    }));
    setImageUploadError(null);
  };

  const handleMajorChange = (selectedMajors) => {
    setFormData(prev => ({
      ...prev,
      generalMajor: selectedMajors
    }));
  };

  const addSpecificMajor = () => {
    setFormData(prev => ({
      ...prev,
      specificMajors: [...prev.specificMajors, '']
    }));
  };

  const removeSpecificMajor = (index) => {
    setFormData(prev => ({
      ...prev,
      specificMajors: prev.specificMajors.filter((_, i) => i !== index)
    }));
  };

  const updateSpecificMajor = (index, value) => {
    setFormData(prev => ({
      ...prev,
      specificMajors: prev.specificMajors.map((major, i) => i === index ? value : major)
    }));
  };

  const handleNext = async () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    setHasAttemptedNext(true);

    const step = steps[currentStep];
    if (step?.id === 'academic' && formData.gradYear < 2026) {
      return;
    }

    if (step?.id === 'password' && (
      formData.password !== formData.confirmPassword || 
      formData.password.length < 6
      )) {
      return;
    }
    
    setHasAttemptedNext(false);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form submitting...', formData);
      setIsSubmitting(true);
      setSubmitError(null);
      setImageUploadError(null);

      try {
        let finalFormData = { ...formData };
      
        if (formData.profilePicture) {
          setIsUploadingImage(true);
          
          const tempUserId = Date.now().toString();
          
          const uploadResult = await uploadProfilePicture(formData.profilePicture, tempUserId);
          
          if (uploadResult.success) {
            finalFormData.profilePictureURL = uploadResult.url;
            finalFormData.profilePicturePath = uploadResult.path;
          } else {
            setImageUploadError(uploadResult.error);
            setIsSubmitting(false);
            setIsUploadingImage(false);
            return;
          }
          
          setIsUploadingImage(false);
        }
        
        const { profilePicture, ...dataToSubmit } = finalFormData;

        const result = await createUserAccount(dataToSubmit, accountType);
        
        if (result.success) {
          console.log('Account created successfully!');

          if (formData.profilePictureURL && formData.profilePictureURL.startsWith('blob:')) {
            URL.revokeObjectURL(formData.profilePictureURL);
          }

          navigate('/');
        } else {
          setSubmitError(result.error);
        }
      } catch (error) {
        setSubmitError('An unexpected error occurred. Please try again.');
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
        setIsUploadingImage(false);
      }
    }
  };

  const handleBack = () => {
    setHasAttemptedNext(false);
    setSubmitError(null);

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setAccountType(null);
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }
  };

  const isStepValid = () => {
    const step = steps[currentStep];
    switch (step?.id) {
      case 'personal':
        if (accountType === 'admin') {
          return formData.firstName && formData.lastName && formData.email && formData.position;
        } else {
          return formData.firstName && formData.lastName && formData.email && 
                 (!formData.isExec || formData.position);
        }
      case 'academic':
        return formData.generalMajor.length > 0 && 
               formData.specificMajors.every(major => major.trim()) &&
               formData.gradYear;
      case 'experience':
        return formData.hasWorkExperience !== null && formData.hasCertificates !== null;
      case 'password':
        return formData.password && formData.confirmPassword;
      case 'review':
        return true;
      default:
        return true;
    }
  };

  // Account type selection screen
  if (!accountType) {
    return (
      <div className="create-account-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <a href='/' className="return-container">
              <MdArrowBack size={25} />
              <span className="signup-label">Return to home page</span>
            </a>
          </div>
          <div className="sidebar-content">
            <h1 className="sidebar-title">Welcome!</h1>
            <p className="sidebar-description">
              Thanks for creating an account, please choose the option that best applies to you.
             </p>
          </div>

          <div className="sidebar-footer">
            <p>Feel free to report any issues you have here or on our website to exec.</p>
          </div>
        </div>

        <div className="main-content">
          <div className="content-container">
            <h1 className="page-title">What type of account?</h1>

            <div className="account-options">
              <button
                onClick={() => setAccountType('member')}
                className="account-option"
              >
                <div className="option-content">
                  <MdOutlineGroup size={35} />
                  <div className="option-text">
                    <h3>Member</h3>
                    <p>For active ambassadors</p>
                  </div>
                </div>
                <span className="option-arrow">→</span>
              </button>

              <button
                onClick={() => setAccountType('admin')}
                className="account-option"
              >
                <div className="option-content">
                  <MdOutlineBadge size={35} />
                  <div className="option-text">
                    <h3>Admin</h3>
                    <p>For advisors and recruitment</p>
                  </div>
                </div>
                <span className="option-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step form
  const currentStepData = steps[currentStep];

  return (
    <div className="create-account-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="return-container">
            <div className={`logo-icon ${accountType === 'admin' ? 'admin-icon' : 'member-icon'}`}></div>
            <span className="signup-label">
              Sign-up - {accountType === 'admin' ? 'Admin' : 'Member'}
            </span>
          </div>
        </div>
        
        <div className="sidebar-content">
          <h2 className="sidebar-title">
            {currentStepData?.id === 'personal' && 'Tell us about yourself'}
            {currentStepData?.id === 'academic' && 'Academic Information'}
            {currentStepData?.id === 'experience' && 'Your Experience'}
            {currentStepData?.id === 'password' && 'Set your password'}
            {currentStepData?.id === 'review' && 'Review your information'}
          </h2>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.id} className={`step-item ${index <= currentStep ? 'active' : 'inactive'}`}>
              <div className={`step-number ${completedSteps.has(index) ? 'completed' : index === currentStep ? 'current' : ''}`}>
                {completedSteps.has(index) ? '✓' : index + 1}
              </div>
              <div className="step-text">
                <div className="step-title">{step.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <p>Thanks for creating an account! Feel free to report any issues you have here or on our website to exec.</p>
        </div>
      </div>

      <div className="main-content">
        <div className="content-container">
          {/* Personal Information Step */}
          {currentStepData?.id === 'personal' && (
            <div className="form-section">
              <h1 className="page-title">Personal Information</h1>
              
              {/* Profile Picture Upload */}
              <ProfilePictureUpload
                profilePicture={formData.profilePicture}
                profilePictureURL={formData.profilePictureURL}
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                disabled={isSubmitting || isUploadingImage}
              />
              
              {imageUploadError && (
                <div className="error-message" style={{marginBottom: '1rem'}}>
                  {imageUploadError}
                </div>
              )}
              
              {isUploadingImage && (
                <div className="upload-status" style={{marginBottom: '1rem', textAlign: 'center', color: '#007bff'}}>
                  Uploading image...
                </div>
              )}

              <div className="form-grid">
                <div className="input-group">
                  <label>First Name*</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>

                <div className="input-group">
                  <label>Last Name*</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>UC Email*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="6+2@mail.uc.edu"
                />
              </div>

              {accountType === 'member' && (
                <>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isExec}
                        onChange={(e) => handleInputChange('isExec', e.target.checked)}
                      />
                      Are you an executive member?
                    </label>
                  </div>

                  {formData.isExec && (
                    <div className="input-group">
                      <label>Executive Position*</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="Executive position name"
                      />
                    </div>
                  )}
                </>
              )}

              {accountType === 'admin' && (
                <>
                  <div className="input-group">
                    <label>Position*</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="e.g. Advisor"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Academic Information Step */}
          {currentStepData?.id === 'academic' && (
            <div className="form-section">
              <h1 className="page-title">Academic Information</h1>
              
              <div>
                <label>General Major* (Select all that apply)</label>
                <div className="checkbox-group">
                  {['Education', 'Criminal Justice', 'Human Services', 'Information Technology'].map(major => (
                      <div key={major} className='checkbox-wrapper'>
                        <input
                          type="checkbox"
                          checked={formData.generalMajor.includes(major)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleMajorChange([...formData.generalMajor, major]);
                            } else {
                              handleMajorChange(formData.generalMajor.filter(m => m !== major));
                            }
                          }}
                        />
                        <label>{major}</label>
                      </div>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Official Major(s)*</label>
                {formData.specificMajors.map((major, index) => (
                  <div key={index} className="dynamic-input">
                    <input
                      type="text"
                      value={major}
                      onChange={(e) => updateSpecificMajor(index, e.target.value)}
                      placeholder="e.g. Early Childhood Education"
                    />
                    {formData.specificMajors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecificMajor(index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecificMajor}
                  className="add-btn"
                >
                  + Add Another Major
                </button>
              </div>

              <div className="input-group">
                <label>Minor(s)</label>
                <input
                  type="text"
                  value={formData.minor}
                  onChange={(e) => handleInputChange('minor', e.target.value)}
                  placeholder="Enter your minor"
                />
              </div>

              <div className="input-group">
                <label>Graduation Year*</label>
                <input
                  type="number"
                  value={formData.gradYear}
                  onChange={(e) => handleInputChange('gradYear', e.target.value)}
                  placeholder="e.g. 2030"
                  min="2026"
                />
                  {hasAttemptedNext && formData.gradYear && parseInt(formData.gradYear) < 2026 && (
                    <span className="error-message">Graduation year must be 2026 or later</span>
                  )}
              </div>

              <div className="input-group">
                <label>Student Organization Involvement</label>
                <textarea
                  value={formData.orgs}
                  onChange={(e) => handleInputChange('orgs', e.target.value)}
                  placeholder="List any student organizations you're involved in"
                  rows="3"
                />
              </div>
            </div>
          )}

          {/* Experience Step */}
          {currentStepData?.id === 'experience' && (
            <div className="form-section">
              <h1 className="page-title">Your Experience</h1>
              
              <div className="input-group">
                <label>Do you have professional experience?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasWorkExperience"
                      checked={formData.hasWorkExperience === true}
                      onChange={() => handleInputChange('hasWorkExperience', true)}
                    />
                    Yes
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasWorkExperience"
                      checked={formData.hasWorkExperience === false}
                      onChange={() => handleInputChange('hasWorkExperience', false)}
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.hasWorkExperience && (
                <div className="input-group">
                  <label>Experience List</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="List your work experience"
                    rows="4"
                  />
                </div>
              )}

              <div className="input-group">
                <label>Do you have any certificates?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasCertificates"
                      checked={formData.hasCertificates === true}
                      onChange={() => handleInputChange('hasCertificates', true)}
                    />
                    Yes
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasCertificates"
                      checked={formData.hasCertificates === false}
                      onChange={() => handleInputChange('hasCertificates', false)}
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.hasCertificates && (
                <div className="input-group">
                  <label>Certificates</label>
                  <textarea
                    value={formData.certs}
                    onChange={(e) => handleInputChange('certs', e.target.value)}
                    placeholder="List your certificates"
                    rows="3"
                  />
                </div>
              )}
            </div>
          )}

          {/* Password Step */}
          {currentStepData?.id === 'password' && (
            <div className="form-section">
              <h1 className="page-title">Create Your Password</h1>
              
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={hasAttemptedNext && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'error' : ''}
                />
                {hasAttemptedNext && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="error-message">Passwords do not match</span>
                )}
                {hasAttemptedNext && (formData.password.length < 6) && (
                  <span className="error-message">Password must be at least 6 characters</span>
                )}
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStepData?.id === 'review' && (
            <div className="form-section">
              <h1 className="page-title">Review Your Information</h1>
              
              {submitError && (
              <div className="error-message" style={{marginBottom: '1rem', textAlign: 'center'}}>
                {submitError}
              </div>
            )}

              <div className="review-section">
                <h3>Personal Information</h3>

                {formData.profilePictureURL && (
                  <div className="review-item">
                    <span className="review-label">Profile Picture:</span>
                    <ProfileIcon 
                      src={formData.profilePictureURL} 
                      size="large"
                      alt="Profile preview"
                    />
                  </div>
                )}

                <div className="review-item">
                  <span className="review-label">Name:</span>
                  <span>{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span>{formData.email}</span>
                </div>
                {accountType === 'admin' && (
                  <div className="review-item">
                    <span className="review-label">Position:</span>
                    <span>{formData.position}</span>
                  </div>
                )}
                {accountType === 'member' && formData.isExec && (
                  <div className="review-item">
                    <span className="review-label">Executive Position:</span>
                    <span>{formData.position}</span>
                  </div>
                )}
              </div>

              {accountType === 'member' && (
                <>
                  <div className="review-section">
                    <h3>Academic Information</h3>
                    <div className="review-item">
                      <span className="review-label">General Majors:</span>
                      <span>{formData.generalMajor.join(', ')}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Specific Majors:</span>
                      <span>{formData.specificMajors.filter(m => m.trim()).join(', ')}</span>
                    </div>
                    {formData.minor && (
                      <div className="review-item">
                        <span className="review-label">Minor:</span>
                        <span>{formData.minor}</span>
                      </div>
                    )}
                    <div className="review-item">
                      <span className="review-label">Graduation Year:</span>
                      <span>{formData.gradYear}</span>
                    </div>
                    {formData.orgs && (
                      <div className="review-item">
                        <span className="review-label">Organizations:</span>
                        <span>{formData.orgs}</span>
                      </div>
                    )}
                  </div>

                  <div className="review-section">
                    <h3>Experience</h3>
                    <div className="review-item">
                      <span className="review-label">Work Experience:</span>
                      <span>{formData.hasWorkExperience ? 'Yes' : 'No'}</span>
                    </div>
                    {formData.experience && (
                      <div className="review-item">
                        <span className="review-label">Details:</span>
                        <span>{formData.experience}</span>
                      </div>
                    )}
                    <div className="review-item">
                      <span className="review-label">Certificates:</span>
                      <span>{formData.hasCertificates ? 'Yes' : 'No'}</span>
                    </div>
                    {formData.certs && (
                      <div className="review-item">
                        <span className="review-label">Certificate Details:</span>
                        <span>{formData.certs}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="button-container">
            <button onClick={handleBack} className="back-btn">
              {currentStep === 0 ? 'Back to selection' : 'Back'}
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="next-btn"
            >
              {isSubmitting ? 'Creating Account...' : 
              currentStep === steps.length - 1 ? 'Create Account' : 'Next'}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
