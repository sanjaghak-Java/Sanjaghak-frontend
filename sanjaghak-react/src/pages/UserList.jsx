import React, { useState } from "react";
import "/src/styles/userList.css"
const initialUsers = [
  {
    id: 1,
    profilePic: "./src/assets/testimage.jpg",
    name: "علی",
    surname: "علیپور",
    phone: "09148325892",
    isActive: true,
    dateJoined: "1403/1/1",
  },
  {
    id: 2,
    profilePic: "./src/assets/testimage.jpg",
    name: "جواد",
    surname: "جوادیزاده",
    phone: "09148325891",
    isActive: false,
    dateJoined: "1403/1/1",
  },
    {
    id: 3,
    profilePic: "./src/assets/testimage.jpg",
    name: "جواد",
    surname: "جوادیزاده",
    phone: "09148325891",
    isActive: false,
    dateJoined: "1403/1/1",
  },
    {
    id: 4,
    profilePic: "./src/assets/testimage.jpg",
    name: "جواد",
    surname: "جوادیزاده",
    phone: "09148325891",
    isActive: false,
    dateJoined: "1403/1/1",
  },
    {
    id: 5,
    profilePic: "./src/assets/testimage.jpg",
    name: "جواد",
    surname: "جوادیزاده",
    phone: "09148325891",
    isActive: false,
    dateJoined: "1403/1/1",
  }
  
];

function UserList() {
  const [users, setUsers] = useState(initialUsers);

  const toggleActive = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  return (
    <div className="userListContainer">
      <table className="userTable">
        <thead>
          <tr>
            <th></th>
            <th>نام</th>
            <th>نام خانوادگی</th>
            <th>شماره تلفن</th>
            <th>وضعیت</th>
            <th>تاریخ عضویت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={user.isActive ? "activeUser" : "inactiveUser"}
            >
              <td>
                <img
                  src={user.profilePic}
                  alt={`${user.name} ${user.surname}`}
                  className="profilePic"
                />
              </td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.phone}</td>
              <td>{user.isActive ? "فعال" : "غیرفعال"}</td>
              <td>{user.dateJoined}</td>
              <td>
                <button
                  className="toggleActiveBtn"
                  onClick={() => toggleActive(user.id)}
                >
                  {user.isActive ? "غیرفعال کردن" : "فعال کردن"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;