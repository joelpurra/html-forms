/*!
 * @license AutoCleanCallback Canada
 * Copyright (c) 2012, 2013 Joel Purra <http://joelpurra.com/>
 * Released under the BSD license.
 *
 * Canadian extensions to AutoCleanCallback (required).
 */

/*jslint white:true */
/*global jQuery:true, JoelPurra:true, debug:true*/

(function($) {
    "use strict";
    (function(namespace) {

        // Calling https://gist.github.com/2254354
        namespace.autoCleanTrimLeft = function($input) {
            debug.log(".autoCleanTrimLeft($input)", $input);

            function cleanTrimLeft($inputToClean) {
                debug.log(".autoCleanTrimLeft($input)", $input, "cleanTrimLeft($inputToClean)", $inputToClean);

                var val = $inputToClean.val(),
                    clean = val.trimLeft();

                if (val !== clean) {
                    return clean;
                }

                return null;
            }

            namespace.autoCleanCallback($input, cleanTrimLeft);
        };
    }(JoelPurra));

    (function(namespace) {

        // Calling https://gist.github.com/2254354
        namespace.autoCleanTrimRight = function($input) {
            debug.log(".autoCleanTrimRight($input)", $input);

            function cleanTrimRight($inputToClean) {
                debug.log(".autoCleanTrimRight($input)", $input, "cleanTrimRight($inputToClean)", $inputToClean);

                var val = $inputToClean.val(),
                    clean = val.trimRight();

                if (val !== clean) {
                    return clean;
                }

                return null;
            }

            namespace.autoCleanCallback($input, cleanTrimRight);
        };
    }(JoelPurra));

    (function(namespace) {

        // Calling https://gist.github.com/2254354
        namespace.autoCleanNorthAmericanPhoneNumber = function($input) {

            debug.log(".autoCleanNorthAmericanPhoneNumber($input)", $input);

            // From http://blog.stevenlevithan.com/archives/validate-phone-number
            var phoneNumberUnformatted = /^\(?([0-9]{3})\)?[\-. ]?([0-9]{3})[\-. ]?([0-9]{4})$/,
                replaceWithFormatted = "($1) $2-$3";

            namespace.autoCleanReplace($input, phoneNumberUnformatted, replaceWithFormatted);
        };
    }(JoelPurra));

    (function() {

        // TODO: patch JoelPurra.autoClean() to accept multiple elements
        var $telephoneInputs = $("[type=tel]");

        $telephoneInputs.each(function() {
            var $this = $(this);

            JoelPurra.autoCleanTrimLeft($this);
            JoelPurra.autoCleanNormalizeWhitespace($this);
            JoelPurra.autoCleanNorthAmericanPhoneNumber($this);
        });

    }());

    (function(namespace) {

        // Calling https://gist.github.com/2254354
        namespace.autoCleanCanadianPostalCode = function($input) {

            debug.log(".autoCleanCanadianPostalCode($input)", $input);

            var postalCodeUnformatted = /^([a-z]\d[a-z])\s*(\d[a-z]\d)$/i,
                replaceWithFormatted = "$1 $2";

            namespace.autoCleanReplace($input, postalCodeUnformatted, replaceWithFormatted);
        };
    }(JoelPurra));

    (function() {

        // A fragile way of matching postal code inputs, but works locally
        var $postalCodeInputs = $("[placeholder=A\\#A\\ \\#A\\#]");

        $postalCodeInputs.each(function() {
            var $this = $(this);

            JoelPurra.autoCleanTrim($this);
            JoelPurra.autoCleanNormalizeWhitespace($this);
            JoelPurra.autoCleanUpperCase($this);
            JoelPurra.autoCleanCanadianPostalCode($this);
        });

    }());
}(jQuery));