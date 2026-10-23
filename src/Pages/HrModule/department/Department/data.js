export const departmentEmployeeColumns = [
  {
    header: "Sl No",
    accessor: "slNo",
  },
  {
    header: "Employee Name",
    accessor: "name",
  },
  {
    header: "Employee Code",
    accessor: "employee_code",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Job Position",
    accessor: "designation",
  },
];


export const departmentData = {
  id: 1,

  departmentName: "Development",

  departmentCode: "DEV-001",

  headOfDepartment: "Riswin",

  teamLead: "Ajay",

  employees: [
    {
      id: 1,
      employee_code: "EMP001",
      employee_name: "John Mathew",
      email: "john@example.com",
      phone: "9876543210",
      status: "Present",
    },
    {
      id: 2,
      employee_code: "EMP002",
      employee_name: "Anu Joseph",
      email: "anu@example.com",
      phone: "9876543211",
      status: "Absent",
    },
    {
      id: 3,
      employee_code: "EMP003",
      employee_name: "Rahul Kumar",
      email: "rahul@example.com",
      phone: "9876543212",
      status: "Present",
    },
    {
      id: 4,
      employee_code: "EMP004",
      employee_name: "Meera Thomas",
      email: "meera@example.com",
      phone: "9876543213",
      status: "On Leave",
    },
    {
      id: 5,
      employee_code: "EMP005",
      employee_name: "Arun Raj",
      email: "arun@example.com",
      phone: "9876543214",
      status: "Present",
    },
  ],
};