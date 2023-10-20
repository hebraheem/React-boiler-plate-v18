import React from "react";

type IAccess = {
  children: JSX.Element;
  allowedRole: string | string[];
};
const AccessControl = ({ children, allowedRole }: IAccess) => {
  const [user, setUser] = React.useState("");

  React.useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setUser(userRole);
    }
  }, []);

  if (Array.isArray(allowedRole) && allowedRole?.includes(user)) {
    return children;
  }
  if (allowedRole === user) return children;
  return null;
};

export default AccessControl;
