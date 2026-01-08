import studentsData from './students.json';
import { events } from './events.js';

export const students = studentsData;
export { events };

export const classes = [
  {
    id: "1",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    start: "09:00 AM",
    end: "10:30 AM",
    subject: "Web Development",
    code: "IT-201",
    room: "Room 15",
    teacher: "Dr. Sarah Ahmed",
    color: "#8B5CF6",
    status: "Completed",
    dayOfWeek: "Monday",
  },
  {
    id: "2",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    start: "11:00 AM",
    end: "12:30 PM",
    subject: "Data Structures",
    code: "CS-103",
    room: "Room 7",
    teacher: "Mr. Ali Khan",
    color: "#22C55E",
    status: "Ongoing",
    dayOfWeek: "Monday",
  },
  {
    id: "3",
    startTime: "01:30 PM",
    endTime: "03:00 PM",
    start: "01:30 PM",
    end: "03:00 PM",
    subject: "Database Systems",
    code: "IT-305",
    room: "Room 21",
    teacher: "Ms. Ayesha Khan",
    color: "#38BDF8",
    status: "Upcoming",
    dayOfWeek: "Wednesday",
  },
  {
    id: "4",
    startTime: "03:30 PM",
    endTime: "05:00 PM",
    start: "03:30 PM",
    end: "05:00 PM",
    subject: "Software Engineering",
    code: "SE-210",
    room: "Room 10",
    teacher: "Mr. Ahmed Raza",
    color: "#FB923C",
    status: "Upcoming",
    dayOfWeek: "Friday",
  },
];
