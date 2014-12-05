/*global define*/

define(
    [],
    function () {
        "use strict";

        function EditRepresenter($q, scope, element, attrs) {
            var watches = [],
                domainObject,
                key;

            function doPersist(model) {
                return $q.when(function () {
                    return domainObject.useCapability("mutation", function () {
                        return model;
                    });
                }).then(function (result) {
                    return result &&
                        domainObject.getCapability("persistence").persist();
                });
            }

            function update() {
                var model = scope.model,
                    configuration = scope.configuration,
                    key = scope.key;

                if (domainObject && domainObject.hasCapability("persistence")) {
                    model.configuration = model.configuration || {};
                    model.configuration[key] = configuration;
                    doPersist(model);
                }
            }

            function destroy() {
                // Stop watching for changes
                watches.forEach(function (deregister) { deregister(); });
                watches = [];
            }

            function represent(representation, representedObject) {
                key = representation.key;
                domainObject = representedObject;

                destroy(); // Ensure existing watches are released

                watches = representedObject.hasCapability("editor") ? [
                    scope.$watch("model", update, true),
                    scope.$watch("configuration", update, true)
                ] : [];
            }

            return {
                represent: represent,
                destroy: destroy
            };
        }

        return EditRepresenter;
    }
);