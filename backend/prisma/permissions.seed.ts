// permissions.seed.ts


// her ek page ka permission assign 

export const permissionCategories = [

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
            "TEMPLATE"
        ]
    },
    {
        module: "EMPLOYEE",
        permissions: [
            "VIEW",
            "CREATE",
            "UPDATE",
            "DELETE",
            "FILTER",
        ],
    },
    {
        module: "CHECKIN",
        permissions: [
            "VIEW",
            "CHECKIN",
            "CHECKOUT",
            "UPDATE",
            "DELETE",
            "FILTER",
        ],
    }
];
