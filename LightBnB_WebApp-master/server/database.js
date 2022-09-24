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
  const query = `
SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id 
WHERE reservations.guest_id = $1
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT $2;`
const values = [guest_id, limit]
return pool.query(query, values).then((res) => {
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows;
});
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;





/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = function (options, limit = 10) {
  
  const queryParams = []; //values
  
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owners_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} owners_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length} `;
  }


  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length} `;
  }
  
  if (options.minimum_rating) {
		queryParams.push(`${options.minimum_rating}`);
		queryString += `GROUP BY properties.id HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
	} else {
		queryString += `GROUP BY properties.id `;
	}

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(`THIS is query ${queryString}, This is values ${queryParams}`);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const query = `INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
  
	const values = [
		property.owner_id,
		property.title,
		property.description,
		property.thumbnail_photo_url,
		property.cover_photo_url,
		property.cost_per_night,
		property.street,
		property.city,
		property.province,
		property.post_code,
		property.country,
		property.parking_spaces,
		property.number_of_bathrooms,
		property.number_of_bedrooms,
	];
	return pool.query(query, values).then((res) => {
		if (res.rows.length === 0) {
			return null;
		}
		return res.rows[0];
	});
};
exports.addProperty = addProperty;
