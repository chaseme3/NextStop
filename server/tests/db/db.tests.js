/*global describe:true, it:true */
'use strict';

//External dependencies
var Promise = require('bluebird');
var Q = require('q');
var expect = require('chai').expect;
var should = require('should');
var _ = require('lodash');


//Internal dependencies
var UserCollection = require('../../models.js').collections.UserCollection;
var ActivityCollection = require('../../models.js').collections.ActivityCollection;
var RegionCollection = require('../../models.js').collections.RegionCollection;
var CountryCollection = require('../../models.js').collections.CountryCollection;
var LocationCollection = require('../../models.js').collections.LocationCollection;
var PostCollection = require('../../models.js').collections.PostCollection;
var PhotoCollection = require('../../models.js').collections.PhotoCollection;
var models = require('../../models');

//ADJUST FOR NEW SCHEMA

describe('Database', function () {

  //tests adding a new user and creating a collection
  describe('User', function () {
    it('should create a new user', function (done) {
      new UserCollection()
        .create({
          'username': 'door'
        })
        .then(function () {
          return UserCollection
            .query('where', 'username', '=', 'door')
            .fetch();
        })
        .then(function (coll) {
          var _username = _.last(coll.toJSON()).username;
          expect(_username).to.equal('door');
          done();
        })
        .catch(function () {
          throw new Error('User not created correctly');
        });
    });
  });

  //tests adding a new activity and creating a collection
  describe('Activity', function () {
    it('should create a new activity', function (done) {
      new ActivityCollection()
        .create({
          'activity_name': 'walking'
        })
        .then(function () {
          return ActivityCollection
            .query('where', 'activity_name', '=', 'walking')
            .fetch();
        })
        .then(function (coll) {
          var _activityName = _.last(coll.toJSON()).activityName;
          expect(_activityName).to.equal('walking');
          done();
        })
        .catch(function () {
          throw new Error('Activity not created correctly');
        });
    });
  });

  //tests adding a new region and creating a collection
  describe('Region', function () {
    it('should create a new region', function (done) {
      new RegionCollection()
        .create({
          'region_name': 'Western Europe'
        })
        .then(function () {
          return RegionCollection
            .query('where', 'region_name', '=', 'Western Europe')
            .fetch();
        })
        .then(function (coll) {
          var _regionName = _.last(coll.toJSON()).regionName;
          expect(_regionName).to.equal('Western Europe');
          done();
        })
        .catch(function () {
          throw new Error('Region not created correctly');
        });
    });
  });

  //tests adding a new country and creating a collection
  describe('Country', function () {
    it('should create a new country', function (done) {
      new CountryCollection()
        .create({
          'country_name': 'France'
        })
        .then(function () {
          return CountryCollection
            .query('where', 'country_name', '=', 'France')
            .fetch();
        })
        .then(function (coll) {
          var _countryName = _.last(coll.toJSON()).countryName;
          expect(_countryName).to.equal('France');
          done();
        })
        .catch(function () {
          throw new Error('Country not created correctly');
        });
    });
  });

  //tests adding a new local_place and creating a collection
  describe('Location', function () {
    it('should create a new location', function (done) {
      new LocationCollection()
        .create({
          'location_name': 'Paris'
        })
        .then(function () {
          return LocationCollection
            .query('where', 'location_name', '=', 'Paris')
            .fetch();
        })
        .then(function (coll) {
          var _locationName = _.last(coll.toJSON()).locationName;
          expect(_locationName).to.equal('Paris');
          done();
        })
        .catch(function () {
          throw new Error('Location not created correctly');
        });
    });
  });


  //tests adding a new post with associations and creating a collection
  describe('Post', function () {
    it('should attach user, activity, region, country, and localPlace to a project', function (done) {
      var user;
      var activity;
      var region;
      var country;
      var location;

      return UserCollection
        .query('where', 'id', '=', '1')
        .fetchOne()
        .then(function (_user) {
          user = _user;
          console.log('1');
        })
        .then(function () {
          return ActivityCollection
            .query('where', 'activity_name', '=', 'walking')
            .fetchOne()
            .then(function (_activity) {
              activity = _activity;
              console.log('2');
            });
        })
        .then(function () {
          return RegionCollection
            .query('where', 'region_name', '=', 'Western Europe')
            .fetchOne()
            .then(function (_region) {
              region = _region;
              console.log('3');
            });
        })
        .then(function () {
          return CountryCollection
            .query('where', 'country_name', '=', 'France')
            .fetchOne()
            .then(function (_country) {
              country = _country;
              console.log('4');
            });
        })
        .then(function () {
          return LocationCollection
            .query('where', 'location_name', '=', 'Paris')
            .fetchOne()
            .then(function (_location) {
              location = _location;
              console.log('5');
            });
        })
        .then(function () {
          console.log('6');
          return new models.Post({
              comment: 'My first post!!',
              user: user,
              activity: activity,
              region: region,
              country: country,
              location: location
            })
            .save()
            .then(function () {
              console.log('7');
              return PostCollection
                .query('where', 'id', '=', '1')
                .fetch();
            })
            .then(function (coll) {
              var postModel = _.last(coll.toJSON());
              console.log('postModel: ', postModel);
              expect(postModel.toJSON().post[0].activityName).to.equal('walking');
              expect(postModel.toJSON().post[0].regionName).to.equal('Western Europe');
              expect(postModel.toJSON().post[0].countryName).to.equal('France');
              expect(postModel.toJSON().post[0].locationName).to.equal('Paris');
              done();
            });
        })
        .catch(function (err) {
          console.log('Error attaching relations to post', err);
        });
    });
  });
});



//ADD TEST FOR PHOTOS

//create model for user with tied project
//tests adding a new project and creating a collection
// describe('User/Project', function () {
//   it('should attach user to a project', function (done) {
//     var project, user;
//     new ProjectCollection()
//       .query('where', 'project_name', '=', 'car')
//       .fetchOne()
//       .then(function (_project) {
//         project = _project;
//         return new UserCollection().query('where', 'username', '=', 'door').fetchOne();
//       })
//       .then(function (_user) {
//         user = _user;
//         return Promise.all([
//           project.related('user').attach(user),
//           user.related('project').attach(project)
//         ]);
//       })
//       .then(function () {
//         return UserCollection.query('where', 'username', '=', 'door').fetchOne({
//           withRelated: ['project']
//         });
//       })
//       .then(function (_user) {
//         expect(_user.toJSON().project[0].projectName).to.equal('car');
//         done();
//       })
//       .catch(function () {
//         expect(false).to.equal(true);
//       });
//   });
// });