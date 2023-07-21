/*
 * Nexxus Stock Keeping (online voorraad beheer software)
 * Copyright (C) 2018 Copiatek Scan & Computer Solution BV
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see licenses.
 *
 * Copiatek – info@copiatek.nl – Postbus 547 2501 CM Den Haag
 */

let selectedImagesInput = [];
let selectedAgreementInput = undefined;

function cancelImageItem(self, filename) {
  for (let i = 0; i < selectedImagesInput.length; i++) {
    if (selectedImagesInput[i].name === filename) {
        selectedImagesInput.splice(i, 1);
        break;
    }
  }
  self.parentNode.remove();
}

function cancelAgreementItem(self) {
  selectedAgreementInput = null;
  self.parentNode.remove();
}

(function($) {

    var debug = false;
    var thisElement;
  
    $.fn.nexxusPickup = function(options) {
  
      // Default options.
      var settings = $.extend({
        recaptchaKey: '6LdzW4QUAAAAANRAfkgl8Cz4-QNUcNEJomOj5wgX',
        orderStatusName: "To plan and pickup",
        locationId: 1,
        maxAddresses: 10,
        confirmPage: null,
        origin: null
      }, options);
  
      thisElement = $(this);
  
      $.ajax({
        url: getMyUrl() + '/api/public/pickup',
        data: settings,
        type: 'GET',
        success: function(data) {
          thisElement.html(data);
          loadScriptsAndStyles();
          changeCountAddresses(0);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          thisElement.html("Error, please check your browser console.");
          console.log(jqXHR);
        }
      });
    };
  
    function getMyUrl() {
      var scripts = Array.from(document.getElementsByTagName("script"));
      var src = scripts.find(function(script) {
        return script.src.endsWith("jquery.nexxus-pickup.js");
      }).src;
      var url = src.substring(0, src.lastIndexOf('/'));
  
      if (debug) {
        url += '/../app_dev.php';
      } else {
        url += '/..';
      }
  
      return url;
    }
  
    function loadScriptsAndStyles() {
  
      if (!bootstrapEnabled()) {
        loadCSS("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
        $.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js", function() {
          thisElement.find('[data-toggle="tooltip"]').tooltip();
        });
      } else {
        thisElement.find('[data-toggle="tooltip"]').tooltip();
      }

      loadCSS(getMyUrl() + "/stylesheet/uploadifive.css");
      loadCSS(getMyUrl() + "/stylesheet/uploadcustomize.css");

      $('#pickup_form_imagesInput').on('change', function() {
        let previewArea = $('#pickup_form_imagesInputPreview');
        
        for (let i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          let reader = new FileReader();
  
          reader.onload = function(e) {
            previewArea.append('<div style="display:inline-block;">\
              <span class="cancel-item" onclick=\'cancelImageItem(this, "' + file.name + '")\'></span>\
              <img src="' + e.target.result + '" alt="' + file.name + '">\
            </div>');
          };
  
          reader.readAsDataURL(file);
          selectedImagesInput.push(file);
        }
      });

      $('#pickup_form_agreementInput').on('change', function() {
        let previewArea = $('#pickup_form_agreementInputPreview');
        previewArea.empty();

        let file = this.files[0];
        let reader = new FileReader();

        reader.onload = function(e) {
          previewArea.append('<div style="display:inline-block;">\
            <span class="cancel-item" onclick="cancelAgreementItem(this)"></span>\
            <span style="margin: 5px;">' + file.name + '</span>\
          </div>');
        };

        reader.readAsDataURL(file);
        selectedAgreementInput = file;
      });

      $('#uploadifive-pickup_form_imagesInput').on('click', function(e) {
        $('#pickup_form_imagesInput').click();
      });

      $('#uploadifive-pickup_form_agreementInput').on('click', function(e) {
        $('#pickup_form_agreementInput').click();
      });
  
      thisElement.find("form").submit(function(e) {
        e.preventDefault();

        console.log("form submit");
        let formData = new FormData();
        $(this).serializeArray().forEach(function(item) {
            return formData.append(item.name, item.value);
        });

        for (let i = 0; i < selectedImagesInput.length; i++) {
          formData.append('pi', selectedImagesInput[i]);
        }

        selectedAgreementInput && formData.append('pa', selectedAgreementInput);
  
        $.ajax({
            type: "POST",
            url: getMyUrl() + '/api/public/pickup',
            data: formData,
			contentType: false,
			processData: false,
          })
          .done(function(response) {
            if (response.substring(0, 4) == "http") {
              window.location.replace(response);
            } else {
              thisElement.html(response);
            }
          })
          .fail(function(xhr, err) {
            thisElement.find("#errorContainer").text(xhr.responseText);
          });
  
        e.preventDefault();
        e.stopPropagation();
  
        return false;
      });
  
      thisElement.find("#pickup_form_countAddresses").change(function() {
        if (parseInt($(this).val()) > parseInt(thisElement.find("#pickup_form_maxAddresses").val())) {
          $(this).val(thisElement.find("#pickup_form_maxAddresses").val());
        }
        changeCountAddresses($(this).val());
      });
    }
  
    function changeCountAddresses(cnt) {
  
      thisElement.find('.pickup_form_address').closest('.form-group').hide();
  
      if (cnt > 0) {
        for (let i = 1; i <= cnt; i++) {
          thisElement.find('#pickup_form_address' + i).closest('.form-group').show();
        }
      }
  
      thisElement.find('.pickup_form_quantity').closest('td').hide();
      thisElement.find('.pickup_form_quantity_1').closest('td').show();
  
      if (cnt > 0) {
        for (let i = 1; i <= cnt; i++) {
          thisElement.find('.pickup_form_quantity_' + i).closest('td').show();
        }
      }
    }
  
    function loadCSS(href) {
  
      var cssLink = $("<link>");
      $("head").append(cssLink); //IE hack: append before setting href
  
      cssLink.attr({
        rel: "stylesheet",
        type: "text/css",
        href: href
      });
  
    };
  
    function bootstrapEnabled() {
      return (typeof $().emulateTransitionEnd == 'function');
    }
  
  }(jQuery));
