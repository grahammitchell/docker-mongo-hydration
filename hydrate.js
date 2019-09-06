conn = new Mongo('the_actual_db');
db = conn.getDB('foster-the-people');

if ( db.getUsers().length == 0 ) {
	db.createUser({user: "AzureDiamond", pwd: "hunter2", roles: ["dbOwner"]});
}

var people = [
  {
    "id": 1,
    "first_name": "Agnola",
    "last_name": "Lush",
    "email": "alush0@mediafire.com"
  },
  {
    "id": 2,
    "first_name": "Bertrando",
    "last_name": "Morphew",
    "email": "bmorphew1@livejournal.com"
  },
  {
    "id": 3,
    "first_name": "Vonnie",
    "last_name": "Leve",
    "email": "vleve2@angelfire.com"
  },
  {
    "id": 4,
    "first_name": "Mercie",
    "last_name": "Collar",
    "email": "mcollar3@youku.com"
  },
  {
    "id": 5,
    "first_name": "Tiphany",
    "last_name": "Marvell",
    "email": "tmarvell4@irs.gov"
  }
]

people.forEach(p => {
	db.people.insert(p);
});

cursor = db.people.find();
while ( cursor.hasNext() ) {
	printjson( cursor.next() );
}
