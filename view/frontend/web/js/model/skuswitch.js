/**
 * Created by thomas on 2017-01-30.
 */

define([
	'jquery',
	'mage/utils/wrapper'
], function ($, wrapper) {
	'use strict';
	return function(targetModule){
		var reloadPrice = targetModule.prototype._reloadPrice;
		targetModule.prototype.dynamic = {};
		$('[data-dynamic]').each(function(){
			var code = $(this).data('dynamic');
			var value = $(this).html();

			targetModule.prototype.dynamic[code] = value;
		});

		var reloadPriceWrapper = wrapper.wrap(reloadPrice, function(original){
			var dynamic = this.options.spConfig.dynamic;
			console.log(dynamic, this.dynamic);
			for (var code in dynamic){
				if (dynamic.hasOwnProperty(code)) {
					var value = "";
					var attr = {};
					var $placeholder = $('[data-dynamic='+code+']');

					if(!$placeholder.length) {
						continue;
					}

					if(this.simpleProduct){
						value = this.options.spConfig.dynamic[code][this.simpleProduct].value;
						attr = this.options.spConfig.dynamic[code][this.simpleProduct].attr;
					} else {
						value = this.dynamic[code];
					}

					$placeholder.html(value);

					// Set all attributes if we have some
					if(attr != undefined) {
						for(a in attr) {
							$placeholder.attr(a, attr[a]);
						}
					}
				}
			}

			return original();
		});

		targetModule.prototype._reloadPrice = reloadPriceWrapper;
		return targetModule;
	};
});
