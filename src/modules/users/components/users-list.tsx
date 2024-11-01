"use client";

import { User } from "@prisma/client";
import React from "react";

export default function UserList() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data.users));
  }, []);
  return (
    <div>
      <ul className="">
        {users.map((user: User) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
