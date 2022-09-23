const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
	const values = [email];
	return pool.query(query, values).then((res) => {
		if (res.rows.length === 0) {
			return null;
		}
		return res.rows[0];
	});
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) { //refresh page when logged in, will stay logged in
  const query = `SELECT * FROM users WHERE id = $1`;
	const values = [id];
	return pool.query(query, values).then((res) => {
		if (res.rows.length === 0) {
			return null;
		}
		return res.rows[0];
	});
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const query = `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`;
	const values = [user.name, user.email, user.password]; //order matters
	return pool.query(query, values).then((res) => {
		if (res.rows.length === 0) {
			return null;
		}
		return res.rows[0];
	});
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = (options, limit = 10) => {
  return pool//return the appropriate pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      // console.log(result.rows);
      
      return result.rows;//Return the appropriate value from our getAllProperties function.
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
