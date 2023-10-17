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

let selectedSalesInput = undefined;

function cancelExcelItem(self) {
  selectedSalesInput = null;
  self.parentNode.remove();
}

(function($) {

    var debug = false;
    var thisElement;
  
    $.fn.nexxusImport = function(options) {
  
      // Default options.
      var settings = $.extend({
        recaptchaKey: '6LdzW4QUAAAAANRAfkgl8Cz4-QNUcNEJomOj5wgX',
        partnerId: 3856,
      }, options);
  
      thisElement = $(this);
  
      $.ajax({
        url: getMyUrl() + '/public/import',
        data: settings,
        type: 'GET',
        success: function(data) {
          thisElement.html(data);
          loadScriptsAndStyles();
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
        return script.src.endsWith("jquery.nexxus-import.js");
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

      $('#import_form_salesInput').on('change', function() {
        let previewArea = $('#import_form_salesInputPreview');
        previewArea.empty();

        let file = this.files[0];
        let reader = new FileReader();

        reader.onload = function(e) {
          previewArea.append('<div style="display:inline-block;">\
            <span class="cancel-item" onclick="cancelExcelItem(this)"></span>\
            <span style="margin: 5px;">' + file.name + '</span>\
          </div>');
        };

        reader.readAsDataURL(file);
        selectedSalesInput = file;
      });

      $('#uploadifive-import_form_salesInput').on('click', function(e) {
        $('#import_form_salesInput').click();
      });
  
      thisElement.find("form").submit(function(e) {
        e.preventDefault();

        console.log("form submit");
        let formData = new FormData();
        $(this).serializeArray().forEach(function(item) {
            return formData.append(item.name, item.value);
        });

        selectedSalesInput && formData.append('file', selectedSalesInput);
  
        $.ajax({
            type: "POST",
            url: getMyUrl() + '/public/import',
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
