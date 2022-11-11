const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  // custom update single dog for event
  async updateDog(ctx) {
    const { id } = ctx.params;

    // {status: string, dog: {_id: string, name: string}}
    const dogWithStatus = ctx.request.body

    const event  = await strapi.services.events.findOne({id});

    // TODO: if no event

    const newEvent = {
      ...event, dogs: [
        ...event.dogs.filter((filteredDogWithStatus) => (filteredDogWithStatus && filteredDogWithStatus.dog._id !== dogWithStatus.dog._id)),
        dogWithStatus
        // remap to save only correct fields (no version, no unused model fields)
      ].map(({status, dog}) => ({status, dog: {name: dog.name, _id: dog._id}}))
    }
    const entity  = await strapi.services.events.update({ id }, newEvent);

    return sanitizeEntity(entity, { model: strapi.models.events });
  },
};
