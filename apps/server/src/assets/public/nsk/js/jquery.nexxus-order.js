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

(function ( $ ) {
 
    var debug = false;
    var thisElement;
    var kvkRegex = /^\d{8}$/;
    var zipRegex = /^\d{4}\s?[A-Za-z]{2}$/;
    
    $.fn.nexxusOrder = function( options ) {
        // Default options.
        var settings = $.extend({
            recaptchaKey: '6LdzW4QUAAAAANRAfkgl8Cz4-QNUcNEJomOj5wgX',
            orderStatusName: "Products to assign",
            products: []
        }, options);

        thisElement = $(this);
 
	    $.ajax({
            url: getMyUrl() + '/public/order',
            data: settings,
            type: 'GET',
            success: function (data) {
                thisElement.html(data);
                loadScriptsAndStyles();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                thisElement.html("Error, please check your browser console.");
                console.log(jqXHR);
            }
        });
    };

    function getMyUrl() {
        var scripts = Array.from(document.getElementsByTagName("script"));
        var src = scripts.find(function(script) {
            return script.src.endsWith("jquery.nexxus-order.js");
          }).src;
        var url = src.substring(0, src.lastIndexOf('/'));
        
        if (debug) {
            url += '/../app_dev.php';
        }
        else {
            url += '/..';
        }

        return url;
    }

    function loadScriptsAndStyles() {

        if (!bootstrapEnabled()) {
            loadCSS("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
            $.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");
        }

        thisElement.find("form").submit(function (e) {
    
            e.preventDefault(); 
            e.stopPropagation();

            var form = $(this);

            var isKvkValid = kvkRegex.test($('#public_order_form_customer_company_kvk_nr').val().trim());
            var isZipValid = zipRegex.test($('#public_order_form_customer_zip').val().trim());
            var checked = $('input[type="checkbox"][name^="public_order_form[terms]"]:checked');
            var quantity0 = parseInt($('#public_order_form_products_0_quantity').val()) || 0;
            var quantity1 = parseInt($('#public_order_form_products_1_quantity').val()) || 0;

            if (!isKvkValid) {
                $('#public_order_form_customer_company_kvk_nr').css('border', '1px solid red');
                $('#public_order_form_customer_error_company_kvk_nr').show();
            }

            if (!isZipValid) {
                $('#public_order_form_customer_zip').css('border', '1px solid red');
                $('#public_order_form_customer_error_zip').show();
            }

            if (checked.length === 0) {
                $('#terms-error').show();
            }

            if (quantity0 + quantity1 < 2) {
                $('#quantity-error').show();
            }

            if (!isKvkValid || !isZipValid || checked.length === 0 || quantity0 + quantity1 < 2) {
                if (!isKvkValid) {
                    $('#public_order_form_customer_company_kvk_nr')[0].scrollIntoView({ behavior: 'auto', block: 'center' });
                    $('#public_order_form_customer_error_company_kvk_nr').blink(3, 100);
                } else if (!isZipValid) {
                    $('#public_order_form_customer_zip')[0].scrollIntoView({ behavior: 'auto', block: 'center' });
                $('#public_order_form_customer_error_zip').blink(3, 100);
                } else if (checked.length === 0) {
                    const firstCheckbox = $('input[type="checkbox"][name^="public_order_form[terms]"]').first()[0];
                    firstCheckbox.scrollIntoView({ behavior: 'auto', block: 'center' });
                    $('#terms-error').blink(3, 100);
                } else if (quantity0 + quantity1 < 2) {
                    const firstProduct = $('#public_order_form_products_0_quantity')[0];
                    firstProduct.scrollIntoView({ behavior: 'auto', block: 'center' });
                    $('#quantity-error').blink(3, 100);
                }

                return false;
            }
    
            $.ajax({
                type: "POST",
                url: getMyUrl() + '/public/order',
                data: form.serialize()
            })
            .done(function (response) {
                if (response.substring(0, 4) == "http") {
                    window.top.location.replace(response);
                }
                else {    
                    thisElement.html(response);
                }
            })
            .fail(function (xhr, err) {
                thisElement.find("#errorContainer").text(xhr.responseText);   
            });
    
            return false;
        });

        thisElement.find('#public_order_form_customer_company_kvk_nr').on('input', function() {
            var isKvkValid = kvkRegex.test($(this).val().trim());

            if (isKvkValid) {
                $(this).css('border', '');
                $('#public_order_form_customer_error_company_kvk_nr').hide();
            }
        });

        thisElement.find('#public_order_form_customer_zip').on('input', function() {
            var isZipValid = zipRegex.test($(this).val().trim());

            if (isZipValid) {
                $(this).css('border', '');
                $('#public_order_form_customer_error_zip').hide();
            }
        });

        thisElement.find('input[type="checkbox"][name^="public_order_form[terms]"]').on('change', function() {
            var checked = $('input[type="checkbox"][name^="public_order_form[terms]"]:checked');

            if (checked.length) {
                $('#terms-error').hide();
            }
        });

        thisElement.find('#public_order_form_products_0_quantity, #public_order_form_products_1_quantity').on('input', function() {
            var quantity0 = parseInt($('#public_order_form_products_0_quantity').val()) || 0;
            var quantity1 = parseInt($('#public_order_form_products_1_quantity').val()) || 0;

            if (quantity0 + quantity1 > 50) {
                $(this).val($(this).data('previousValue') || 0); // Reset to previous value
            } else {
                // Save the current value
                $(this).data('previousValue', $(this).val());
            }

            if (quantity0 + quantity1 >= 2) {
                $('#quantity-error').hide();
            }
        });
    }

    function loadCSS(href) {
    
        var cssLink = $("<link>");
        $("head").append(cssLink); //IE hack: append before setting href

        cssLink.attr({
            rel:  "stylesheet",
            type: "text/css",
            href: href
        });

    };

    function bootstrapEnabled() {
        return (typeof $().emulateTransitionEnd == 'function');
    }
    
    $.fn.blink = function(times = 3, speed = 300) {
    return this.each(function() {
        let $el = $(this);
        let i = 0;

        function blink() {
            if (i < times) {
            $el.fadeOut(speed).fadeIn(speed, function() {
                i++;
                blink();
            });
            }
        }

        blink();
        });
    };
 
}( jQuery )); 
