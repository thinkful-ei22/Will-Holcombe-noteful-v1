/* global $ */
'use strict';

const api = {

  
  search: function (query) {
    return $.ajax({
      type: 'GET',
      url: '/api/notes/',
      dataType: 'json',
      data: query
    });
  },
  

  details: function (id, callback) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `/api/notes/${id}`,
      success: callback
    });
  },



update: function (id, obj, callback) {
  $.ajax({
   type: 'PUT',
    url: `/api/notes/${id}`,
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(obj),
    success: callback
  });
}
};

