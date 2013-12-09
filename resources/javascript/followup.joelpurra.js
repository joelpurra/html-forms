/*!
 * @license FollowUp
 * Copyright © 2012, 2013 Joel Purra <http://joelpurra.se/>
 * Released under MIT, BSD and GPL license. Comply with at least one.
 *
 * https://github.com/joelpurra/followup
 *
 * A jQuery plugin to show and hide follow up questions in a form. The
 * follow ups are specified through HTML5 [data-*] attributes.
 */

/*jslint white: true, todo: true */
/*global jQuery: true */

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function($, namespace) {
    "use strict";
    var tag = "FollowUp",
        eventNamespace = "." + tag,
        fuq = namespace.FollowUp = namespace.FollowUp || {};

    fuq.getMode = function($element) {
        return $element.attr("data-has-follow-up");
    };

    fuq.getTarget = function($element) {
        var $target, mode = fuq.getMode($element);

        switch (mode) {
            case "sibling":
                $target = $element.parent().find("[data-is-follow-up]");
                break;

                // case "selector" is the default/fallback
            default:
                $target = $($element.attr("data-target"));
                break;
        }

        return $target;
    };

    fuq.getRadioGroup = function($element) {
        // TODO: escape name
        return $element.closest("form").find(":radio[name=" + $element.attr("name") + "]");
    };

    fuq.getGroup = function($element) {
        var $elements;

        if ($element.is(":radio")) {
            $elements = fuq.getRadioGroup($element);
        } else {
            $elements = $element.closest("[data-has-follow-ups]").find("[data-has-follow-up]");
        }

        return $elements.add($element).filter("[data-has-follow-up]");
    };

    fuq.showHide = function($element) {
        var $target = fuq.getTarget($element);

        // TODO: animations? Inline elements do not animate well.
        // http://stackoverflow.com/questions/231937/animating-inline-elements-with-jquery
        if ($element.is(":checked")) {
            $target.show();

            // Add or remove follow up required flags
            $target.find("[data-is-follow-up-required=required]").attr("required", "required");
        } else {
            $target.hide();

            // Add or remove follow up required flags
            $target.find("[data-is-follow-up-required=required]").removeAttr("required");
        }
    };

    fuq.checkGroup = function($group) {
        $group.each(function() {
            fuq.showHide($(this));
        });
    };

    fuq.check = function() {
        var $this = $(this),
            $group = fuq.getGroup($this);

        fuq.checkGroup($group);
    };

    $(function() {
        // TODO: use document level dynamic filtering to catch dynamically inserted questions/form elements?
        var $watch = $("[data-has-follow-ups], [data-has-follow-up]");

        $watch.on("change" + eventNamespace, fuq.check);

        fuq.checkGroup($watch);
    });
}(jQuery, JoelPurra));