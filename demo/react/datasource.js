const dbDescription = {
  entities: {
    customers: {
      attributes: [
        {
          name: "customerNumber",
          isPrimaryKey: true
        },
        "customerName",
        "contactLastName",
        "contactFirstName",
        "phone",
        "addressLine1",
        "addressLine2",
        "city",
        "state",
        "postalCode",
        "country",
        "salesRepEmployeeNumber",
        "creditLimit"
      ],
    },
    employees: {
      attributes: [
        {
          name: "employeeNumber",
          isPrimaryKey: true
        },
        "lastName",
        "firstName",
        "extension",
        "email",
        "officeCode",
        "reportsTo",
        "jobTitle",
      ]
    },
    offices: {
      attributes: [
        {
          name: "officeCode",
          isPrimaryKey: true
        },
        "city",
        "phone",
        "addressLine1",
        "addressLine2",
        "state",
        "country",
        "postalCode",
        "territory",
      ]
    },
    orders: {
      attributes: [
        {
          name: "orderNumber",
          isPrimaryKey: true
        },
        "orderDate",
        "requiredDate",
        "shippedDate",
        "status",
        "comments",
        "customerNumber",
      ]
    },
    orderdetails: {
      attributes: [
        {
          name: "orderNumber",
          isPrimaryKey: true
        },
        {
          name: "productCode",
          isPrimaryKey: true
        },
        "quantityOrdered",
        "priceEach",
        "orderLineNumber",
      ]
    },
    payments: {
      attributes: [
        {
          name: "customerNumber",
          isPrimaryKey: true
        },
        {
          name: "checkNumber",
          isPrimaryKey: true
        },
        "paymentDate",
        "amount",
      ]
    },
    productlines: {
      attributes: [
        {
          name: "productLine",
          isPrimaryKey: true
        },
        "textDescription",
        "htmlDescription",
        "image"
      ]
    },
    products: {
      attributes: [
        {
          name: "productCode",
          isPrimaryKey: true
        },
        "productName",
        "productLine",
        "productScale",
        "productVendor",
        "productDescription",
        "quantityInStock",
        "buyPrice",
        "MSRP"
      ]
    }
  },
  relationships: [{
    title: "Customers",
    parent: "employees",
    child: "customers",
    childKey: "salesRepEmployeeNumber"
  },
  {
    title: "Reporters",
    parent: "employees",
    child: "employees",
    childKey: "reportsTo"
  },
  {
    title: "Employees",
    parent: "offices",
    child: "employees",
    childKey: "officeCode"
  },
  {
    parent: "productlines",
    child: "products",
    childKey: "productLine"
  },
  {
    parent: "products",
    child: "orderdetails",
    childKey: "productCode"
  },
  {
    parent: "orders",
    child: "orderdetails",
    childKey: "orderNumber"
  },
  {
    parent: "customers",
    child: "orders",
    childKey: "customerNumber"
  },
  {
    parent: "customers",
    child: "payments",
    childKey: "customerNumber"
  },]
};