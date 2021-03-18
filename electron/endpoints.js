const fs = require("fs");
const path_database = __dirname + "/databases/database_default.json";

const get = (payload) => {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(path_database);
    resolve(JSON.parse(data));
    fs.close();
  });
};

const post = (payload) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path_database)) {
      const data = JSON.parse(fs.readFileSync(path_database));
      data.database_default.collection_registers.push(payload);
      fs.writeFile(path_database, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
        resolve(data);
      });
    } else {
      const struture = {
        database_default: {
          collection_registers: [payload],
        },
      };

      fs.writeFile(path_database, JSON.stringify(struture), (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
        resolve(struture);
      });
    }
  });
};

const search = (payload) => {
  return new Promise(async (resolve) => {
    const data = await get();
    const search = JSON.parse(payload).search;

    const find = data.database_default.collection_registers.find(
      (payload) => payload.description === search
    );
    find ? resolve(find) : resolve([]);
  });
};

const user = {
  name: "kakashi",
  email: "kakashi@gmail.com",
  id: 0,
  created_at: new Date().getTime(),
  updated_at: new Date().getTime(),
  edit: false,
  photo_url: "",
  credit_card: "visa",
};

const register = {
  position: 0,
  category: "Outros",
  created_at: new Date().getTime(),
  updated_at: new Date().getTime(),
  value: 1889,
  type: "incoming",
  status: "done",
  id: 0 | "",
  description: "outros",
  operation: "credit",
  brand: "visa",
  edit: false,
  user: user,
};

// get().then(res => console.log(res))
// post(register).then((res) => console.log(res));

module.exports = {
  get,
  post,
  search,
};
