export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  avatar?: string;
};

export const users: User[] = [
  {
    id: "u1",
    fullName: "Nguyễn Văn A",
    email: "user1@gmail.com",
    password: "123456",
    role: "USER",
    avatar: "/images/avatar/user1.png",
  },
  {
    id: "u2",
    fullName: "Trần Thị B",
    email: "user2@gmail.com",
    password: "123456",
    role: "USER",
    avatar: "/images/avatar/user2.png",
  },
  {
    id: "u3",
    fullName: "Lê Minh C",
    email: "user3@gmail.com",
    password: "123456",
    role: "USER",
    avatar: "/images/avatar/user3.png",
  },
  {
    id: "admin1",
    fullName: "Admin Popcorn",
    email: "admin@gmail.com",
    password: "admin123",
    role: "ADMIN",
    avatar: "/images/avatar/admin.png",
  },
];