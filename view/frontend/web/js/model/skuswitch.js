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
		targetModule.prototype.dynamicCssClass = {};

		$('[data-dynamic]').each(function(){
			var code = $(this).data('dynamic');
			var value = $(this).html();
			var cssClass = $(this).attr('class');

			targetModule.prototype.dynamic[code] = value;
			targetModule.prototype.dynamicCssClass[code] = cssClass;
		});

		var reloadPriceWrapper = wrapper.wrap(reloadPrice, function(original){
			var dynamic = this.options.spConfig.dynamic;
			console.log(dynamic, this.dynamic);
			for (var code in dynamic){
				if (dynamic.hasOwnProperty(code)) {
					var value = "";
					var cssClass = '';
					var $placeholder = $('[data-dynamic='+code+']');

					if(!$placeholder.length) {
						continue;
					}

					if(this.simpleProduct){
						value = this.options.spConfig.dynamic[code][this.simpleProduct].value;
						cssClass = this.options.spConfig.dynamic[code][this.simpleProduct].cssClass == undefined ? '' : this.options.spConfig.dynamic[code][this.simpleProduct].cssClass;
					} else {
						value = this.dynamic[code];
						cssClass = this.dynamicCssClass[code];
					}

					console.log(value, cssClass, dynamic[code]);

					$placeholder.html(value);
				}
			}

			return original();
		});

		targetModule.prototype._reloadPrice = reloadPriceWrapper;
		return targetModule;
	};
});
