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
      productCode: {
        isPrimaryKey
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

var demodata = window.demodata;
var db = {};

Object.keys(dbDescription.entities).forEach((entity) => {
  db[entity] = [];
  var attrs = Object.keys(dbDescription.entities[entity].attributes);
  demodata[entity].forEach(function (row) {
    var obj = { key: row[0], data: {} };

    attrs.forEach(function (attr, idx) {
      obj.data[attr] = row[idx];
    })

    db[entity].push(obj);
  })
})

console.log(db);

function getData(entityId, attributes, options, ready) {
  console.log(entityId, attributes, options);

  let data = db[entityId];
  if (options.filter) {
    if (options.filter.type == "EQ") {
      data = data.filter(d => d.data[options.filter.field] == options.filter.value);
    }
  }
  if (options.offset) data = data.slice(options.offset);
  if (options.limit) data = data.slice(0, options.limit);

  data = data.map((d) => {
    var row = { key: d.key, data: {} };
    attributes.forEach((a) => {
      row.data[a] = d.data[a];
    });
    return row;
  })
  ready(data);
};