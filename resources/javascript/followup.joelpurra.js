/*!
 * @license FollowUpQuestions
 * Copyright © 2012 Joel Purra <http://joelpurra.se/>
 * Released under MIT, BSD and GPL license. Comply with at least one.
 *
 * A jQuery plugin to show and hide follow up questions in a form. The
 * follow ups are specified through HTML5 [data-*] attributes.
 */
// https://gist.github.com/3024198
//
// USAGE
// Include the script after jQuery has been loaded. It will check all existing form elements
// and automatically initilaize follow-up questions when the page has loaded.
//
// Note: currently only <input type="radio" /> or <input type="checkbox" /> can have follow up
// questions, visible when the input has been checked.
//
// Markup for a single question (form input) that has a follow up question
//  data-has-follow-up="sibling"
//      "sibling" assumes the follow up question(s) containers shares the same parent element.
//  data-has-follow-up="selector"
//  data-target="#follow-up-question-container-elsewhere"
//      "selector" allows addressing any other data-target="..." container element(s) with
//      a jQuery style selector.
//
// Markup for containers with multiple radio buttons inside
//  data-has-follow-ups=""
// 
// Markup for a question that is required when it is a follow up question
//  data-is-follow-up-required="required"
//
// Markup for the container of a follow up container
//  data-is-follow-up=""
//
// EXAMPLE WITH A GROUP OF RADIO BUTTONS
// Only one of the <input type="radio" /> buttons has a follow up question. Since they are in
// the same group, they will be evaulated together. Changing from yes to no will change the
// visibility of the follow up question <textarea>.
//
// <p data-has-follow-ups="">
//     Have you ever had a close encounter with a UFO (Unidentified Flying Object)?
//     <label><input type="radio" name="seen-ufo" required="required" data-has-follow-up="sibling" /> Yes
//         <label data-is-follow-up="">Please explain the encounter, especially what kind it was
//             <textarea data-is-follow-up-required="required"></textarea>
//         </label>
//     </label>
//     <label><input type="radio" name="seen-ufo" required="required" /> No</label>
// </p>
//
// TODO LIST
//  - Use with <select> dropdowns.
//  - Use with other <input /> typs and <textarea>?
//  - Use dynamic change listener.
//      - or - 
//  - Expose a function to dynamically add questions with follow ups.
//  - Animations when showing/hiding elements.
//  - Package the plugin better.
//
/*jslint white: true, browser: true*/
/*global jQuery*/

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function($, namespace) {
    "use strict"; // jshint ;_;
    var tag = "FollowUpQuestion",
        eventNamespace = "." + tag,
        fuq = namespace.FollowUpQuestion = namespace.FollowUpQuestion || {};

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