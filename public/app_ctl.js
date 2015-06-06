/*globals angular, document, JST, window, _ */
angular.module('app')
  .controller('homeCtl', function ($scope, $http, $q) {
    'use strict';
    var one_url = '/one';
    var two_url = '/two';
    var three_url = '/three';

    /*
    request a resource from server & return a promise
    */
    var http_get = function (url) {
      return $http.get(url);
    };

    /*
    basic callbacks pyramid pattern
    */
    $scope.callbackExample = function () {
      console.log('callbackExample started');
      var res = [];
      http_get(one_url).
        success(function (data) {
          res.push(data.num);
          http_get(two_url).
            success(function (data) {
              res.push(data.num);
              http_get(three_url).
                success(function (data) {
                  res.push(data.num);
                  console.log('callback example done', res);
                }).
                error(function () {
                  console.error('failed to get three', res);
                });
            }).
            error(function () {
              console.error('failed to get two', res);
            });
        }).
        error(function () {
          console.error('failed to get one', res);
        });
    };

    /*
    bad promise chaining. the then function is activated after the first promise has resolved
    */
    $scope.promiseBadExample = function () {
      console.log('promiseBadExample started');
      http_get(one_url)
        .then(http_get(two_url))
        .then(http_get(three_url))
        .then(function () {
          console.log('already finished?!, better check the network traffic!');
        }).catch(function () {
          console.log('somthing went wrong');
        });
    };

    /*
    proper promise chaining. each resolved promise triggers next promise request
    */
    $scope.promiseGoodExample = function () {
      console.log('promiseGoodExample started');
      var res = [];
      http_get(one_url).then(function (promsied_data) {
        res.push(promsied_data.data.num);
        return http_get(two_url).then(function (promsied_data) {
          res.push(promsied_data.data.num);
          return http_get(three_url).then(function (promsied_data) {
            res.push(promsied_data.data.num);
            console.log('promiseGoodExample done', res);
          });
        });
      });
    };

    /*
    proper promise chaining. each resolved promise triggers next promise request. if promise has rejected handle the error.
    same pyramid pattern
    */
    $scope.promiseBetterExample = function () {
      console.log('promiseBetterExample started');
      var res = [];
      http_get(one_url).then(function (promsied_data) {
        res.push(promsied_data.data.num);
        return http_get(two_url).then(function (promsied_data) {
          res.push(promsied_data.data.num);
          return http_get(three_url).then(function (promsied_data) {
            res.push(promsied_data.data.num);
            console.log('promiseBetterExample done', res);
          }).catch(function () {
            console.error('failed to get three', res);
          });
        }).catch(function () {
          console.error('failed to get two', res);
        });
      }).catch(function () {
        console.error('failed to get one', res);
      });
    };

    /*
    preform a series of actions, dont care which order they are completed.
    we need to know when all of them resolved or if one of them rejected.
    if we use callback we'll end up with the pyramid pattern...
    $q & promises to the rescue
    */
    $scope.promiseQueueExample = function () {
      console.log('promiseQueueExample started');
      var res = [];
      var promises = [];
      var urls = [one_url, two_url, three_url];
      var pushToResArr = function (val) {
        res.push(val.data.num);
      };
      var printResArr = function () {
        console.log('promiseQueueExample ended', res);
      };
      var printErr = function () {
        console.log('promiseQueueExample with error', res);
      };

      // create all promises and give each a thenable function
      _.forEach(urls, function (u) {
        promises.push(http_get(u).then(pushToResArr));
      });
      // when all promises have resovled, activate final thenable. 
      //if an error accuered at any op the promisses, the catch block will be activated
      $q.all(promises).then(printResArr).catch(printErr);
    };
  });

