// permissions.seed.ts


// her ek page ka permission assign 

export const permissionCategories = [
    {
        module: "ATTENDANCE",
        permissions: [
            "VIEW",
            "CHECKIN",
            "UPDATE",
            "DELETE",
        ],
    },
    {
        module: "ROLE",
        permissions: [
            "VIEW",
            "CREATE",
            "UPDATE",
            "DELETE"
        ]
    },
    {
        module: "MONTHLY_ATTENDANCE",
        permissions: [
            "VIEW",
            "FILTER",
            "IMPORT",
            "EXPORT",
        ],
    },
    {
        module: "EMPLOYEE",
        permissions: [
            "VIEW",
            "CREATE",
            "UPDATE",
            "DELETE",
        ],
    },
];
