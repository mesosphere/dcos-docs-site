// Nginx
// Source: https://github.com/karlkfi/ngindox/blob/master/include/ngindox.js
// requires jquery
window.NgindoxInit = function() {

  // toggle visibility of all route groups
  $('#ngindox .toggle-route-groups').click(function() {
    var visible = ($(this).attr('data-state') != 'hidden');
    $(this).attr('data-state', visible && 'hidden' || 'visible');

    $('#ngindox .routes').each(function() {
      var route = $(this);
      if (visible) {
        route.closest('.resource').find('.heading .arrow-down').toggleClass('arrow-right arrow-down');
        route.slideUp('slow');
      } else {
        route.closest('.resource').find('.heading .arrow-right').toggleClass('arrow-down arrow-right');
        route.slideDown('slow');
      }
    })
  });

  // toggle visibility of routes by group
  $('#ngindox .resources .toggle-route-group').click(function() {
    var resource = this.getAttribute('data-id');
    if (!resource) {
      return;
    }
    var route = $('#routes-' + resource);
    if (route.is(':visible')) {
      $(this).find('.arrow-down').toggleClass('arrow-right arrow-down');
      route.slideUp('slow');
    } else {
      $(this).find('.arrow-right').toggleClass('arrow-down arrow-right');
      route.slideDown('slow');
    }
  });

  // toggle visibility of routes by type
  $('#ngindox .legend .toggle-route-type').click(function() {
    var checkbox = $(this).closest('.route').find('input');
    checkbox.prop("checked", !checkbox.prop("checked")).trigger('change');
  });

  // set visibility of routes by type
  $('#ngindox .legend .route input').on('change', function() {
    var routeType = this.getAttribute('data-type');
  if (!routeType) {
    return;
  }
    if (this.checked) {
      $('.resources .route-type-' + routeType).slideDown('slow');
    } else {
      $('.resources .route-type-' + routeType).slideUp('slow');
    }
  })

  // toggle visibility of route meta
  $('#ngindox .resources .route .route-type').click(function() {
    $(this).closest('.route').find('.route-meta').slideToggle('slow');
  });
};
$(document).ready(NgindoxInit);