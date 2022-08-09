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
    }
  },
  relationships: [{
    title: "Customers",
    parent: "employees",
    child: "customers",
    childKey: "salesRepEmployeeNumber"
  }]
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