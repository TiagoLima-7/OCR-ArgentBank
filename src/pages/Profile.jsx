import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../services/apiService";
import { fetchUserProfile } from "../redux/slices/authSlice";
import AccountCard from "../components/AccountCard";

const accounts = [
  {
    id: 1,
    title: "Argent Bank Checkings (x8349)",
    amount: "$2,082.79",
    description: "Available Balance",
  },
  {
    id: 2,
    title: "Argent Bank Savings (x6712)",
    amount: "$10,928.42",
    description: "Available Balance",
  },
  {
    id: 3,
    title: "Argent Bank Credit Card (x8349)",
    amount: "$184.30",
    description: "Current Balance",
  },
];

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
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          title={account.title}
          amount={account.amount}
          description={account.description}
        />
      ))}
    </main>
  );
}

export default Profile;
