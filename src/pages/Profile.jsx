import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../services/apiService";
import { fetchUserProfile } from "../redux/slices/authSlice";

function Profile() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleEditClick = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateUserProfile(token, { firstName, lastName });
    dispatch(fetchUserProfile(token));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <main className="main bg-light">
      <div className="header">
        {isEditing ? (
          <>
            <h1>Welcome back</h1>
            <div className="edit-form">
              <div className="edit-form-inputs">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="edit-form-buttons">
                <button className="edit-save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="edit-cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>
              Welcome back
              <br />
              {user?.firstName} {user?.lastName}!
            </h1>
            <button className="edit-button" onClick={handleEditClick}>
              Edit Name
            </button>
          </>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
