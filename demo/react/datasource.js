const dbDescription = {
  entities: {
    customers: {
      attributes: {
        customerNumber: {
          isPrimaryKey: true
        },
        customerName: {},
        contactLastName: {},
        contactFirstName: {},
        phone: {},
        addressLine1: {},
        addressLine2: {},
        city: {},
        state: {},
        postalCode: {},
        country: {},
        salesRepEmployeeNumber: {},
        creditLimit: {}
      }
    },
    employees: {
      attributes: {
        employeeNumber: {
          isPrimaryKey: true
        },
        lastName: {},
        firstName: {},
        extension: {},
        email: {},
        officeCode: {},
        reportsTo: {},
        jobTitle: {},
      }
    },
    offices: {
      attributes: {
        officeCode: {
          isPrimaryKey: true
        },
        city: {},
        phone: {},
        addressLine1: {},
        addressLine2: {},
        state: {},
        country: {},
        postalCode: {},
        territory: {},
      }
    },
    orders: {
      attributes: {
        orderNumber: {
          isPrimaryKey: true
        },
        orderDate: {},
        requiredDate: {},
        shippedDate: {},
        status: {},
        comments: {},
        customerNumber: {},
      }
    },
    orderdetails: {
      attributes: {
        orderNumber: {
          isPrimaryKey: true
        },
        productCode: {
          isPrimaryKey: true
        },
        quantityOrdered: {},
        priceEach: {},
        orderLineNumber: {},
      }
    },
    payments: {
      attributes: {
        customerNumber: {
          isPrimaryKey: true
        },
        checkNumber: {
          isPrimaryKey: true
        },
        paymentDate: {},
        amount: {},
      }
    },
    productlines: {
      attributes: {
        productLine: {
          isPrimaryKey: true
        },
        textDescription: {},
        htmlDescription: {},
        image: {}
      }
    },
    products: {
      attributes: {
        productCode: {
          isPrimaryKey: true
        },
        productName: {},
        productLine: {},
        productScale: {},
        productVendor: {},
        productDescription: {},
        quantityInStock: {},
        buyPrice: {},
        MSRP: {}
      }
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