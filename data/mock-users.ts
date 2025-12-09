export type UserRow = {
  id: number;
  name: string;
  email: string;
  subscription: string;
  devices: number;
  joined: string;
  status: string;
  isBanned: boolean;
  isNew: boolean;
};

export const mockUsers: UserRow[] = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    subscription: "Premium",
    devices: 3,
    joined: "2025-12-01",
    status: "active",
    isBanned: false,
    isNew: false,
  },
  {
    id: 2,
    name: "Bob Lee",
    email: "bob@example.com",
    subscription: "Free",
    devices: 1,
    joined: "2025-12-08",
    status: "active",
    isBanned: false,
    isNew: true,
  },
  {
    id: 3,
    name: "Charlie Kim",
    email: "charlie@example.com",
    subscription: "Premium",
    devices: 2,
    joined: "2025-11-20",
    status: "banned",
    isBanned: true,
    isNew: false,
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@wondermail.com",
    subscription: "Premium",
    devices: 4,
    joined: "2025-12-05",
    status: "active",
    isBanned: false,
    isNew: false,
  },
  {
    id: 5,
    name: "Ethan Hunt",
    email: "ethan@imf.com",
    subscription: "Free",
    devices: 2,
    joined: "2025-12-07",
    status: "active",
    isBanned: false,
    isNew: true,
  },
  {
    id: 6,
    name: "Fiona Gallagher",
    email: "fiona@shameless.com",
    subscription: "Premium",
    devices: 1,
    joined: "2025-12-03",
    status: "active",
    isBanned: false,
    isNew: false,
  },
  {
    id: 7,
    name: "George Clooney",
    email: "george@hollywood.com",
    subscription: "Free",
    devices: 3,
    joined: "2025-12-02",
    status: "banned",
    isBanned: true,
    isNew: false,
  },
  {
    id: 8,
    name: "Hannah Baker",
    email: "hannah@13reasons.com",
    subscription: "Premium",
    devices: 2,
    joined: "2025-12-06",
    status: "active",
    isBanned: false,
    isNew: true,
  },
  {
    id: 9,
    name: "Ian Malcolm",
    email: "ian@jurassic.com",
    subscription: "Free",
    devices: 1,
    joined: "2025-12-04",
    status: "active",
    isBanned: false,
    isNew: false,
  },
  {
    id: 10,
    name: "Julia Roberts",
    email: "julia@hollywood.com",
    subscription: "Premium",
    devices: 3,
    joined: "2025-12-01",
    status: "active",
    isBanned: false,
    isNew: false,
  },
];
