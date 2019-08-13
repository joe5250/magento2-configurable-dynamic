/**
 * Created by thomas on 2017-01-30.
 */

define([
	'jquery',
	'mage/utils/wrapper',
	'mage/apply/main'
], function ($, wrapper, mage) {
	'use strict';
	return function(targetModule){
		var reloadPrice = targetModule.prototype._reloadPrice;
		targetModule.prototype.dynamic = {};
		targetModule.prototype.dynamicAttrs = [];

		$('[data-dynamic]').each(function(){
			var code = $(this).data('dynamic');
			var value = $(this).html();
			var attrs = [];

			// Get the initial attributes value to be able to reset them if a user selects an option and then selects none again
			$.each(this.attributes, function() {
				attrs[this.name] = this.value;
			});

			targetModule.prototype.dynamic[code] = value;
			targetModule.prototype.dynamicAttrs[code] = attrs;
		});

		var reloadPriceWrapper = wrapper.wrap(reloadPrice, function(original){
			var dynamic = this.options.spConfig.dynamic;

			for (var code in dynamic){
				if (dynamic.hasOwnProperty(code)) {
					var value = "";
					var attrs = [];
					var $placeholder = $('[data-dynamic='+code+']');

					if(!$placeholder.length) {
						continue;
					}

					if(this.simpleProduct){
						value = this.options.spConfig.dynamic[code][this.simpleProduct].value;
						attrs = this.options.spConfig.dynamic[code][this.simpleProduct].attrs;
					} else {
						value = this.dynamic[code];
                        attrs = this.dynamicAttrs[code];
					}

					$placeholder.html(value);

					// Set all attributes if we have some
					if(attrs != undefined) {
						for(var a in attrs) {
							$placeholder.attr(a, attrs[a]);
						}
					}
				}
			}

			mage.apply();

			return original();
		});

		targetModule.prototype._reloadPrice = reloadPriceWrapper;
		return targetModule;
	};
});
