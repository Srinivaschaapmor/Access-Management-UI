const host = process.env.REACT_APP_HOST;

export const loginEmail = `${host}/login/send-otp`;
export const verifyOtp = `${host}/login/verify-otp`;
export const editAccess = `${host}/users/update/access`;
export const deleteAllAccess = `${host}/users/delete/allAccess`;
export const getUsers = `${host}/endusers`;
export const getUsersWithAccess = `${host}/users_with_access`;
export const updateUser = `${host}/users/update`;
export const createUser = `${host}/create_user`;
export const DeleteUser = `${host}/users/delete`;
export const deleteUserAccess = `${host}/users/delete/access`;
export const fetchMasterData = `${host}/masterdata/`;
