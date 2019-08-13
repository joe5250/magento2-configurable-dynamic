# magento2-configurable-sku-switch

### Status

Tested by me on magento 2.1.3 (blank theme), works also on Magento 2.2 and Magento 2.3.

Do not expect this module to be updated/bugg fixed/altered for any specific magento version

### Purpose
Change data for configurable on frontend to show the data for selected product.

### Currently changed by default
* sku
* description
* title (product name)
* attributes tab

#### Customize HTML-Attributes per simple product

You can change text and attributes with this module.
If nothing else is configured, it changes only the text.

To add custom HTML-Attributes to elements, like css classes, you need to plugin 
`Magento\ConfigurableProduct\Block\Product\View\Type\Configurable` and `Magento\Swatches\Block\Product\Renderer\Configurable`
with a method `afterGetJson` like so:

```php
public function afterGetJsonConfig($subject, $result)
{
    $jsonResult = json_decode($result, true);

    foreach ($subject->getAllowProducts() as $simpleProduct) {
        $id = $simpleProduct->getId();
        $shippingCost = $this->getMyCustomValueForProduct();
        $jsonResult['dynamic']['custom_extra_element_label'][$id] = [
            'value' => $shippingCost,
            'attrs' =>  [
                'class' => 'some-css-class'
            ]
        ];
    }

    $result = json_encode($jsonResult);
    return $result;
}
```

#### Show whole blocks dynamically
You can change whole blocks.

**Preconditions:**  
* The block class MUST provide a method `setProduct()`. See `\Andering\ConfigurableDynamic\Block\Product\View\Attributes` for example
* You must create a wrapper block and move the block into the wrapper. See: `view/frontend/layout/catalog_product_view.xml`for example

Then you can create a plugin like `\Andering\ConfigurableDynamic\Plugin\Magento\ConfigurableProduct\Block\Product\View\Type\Configurable`. 
You have to inject `\Andering\ConfigurableDynamic\Helper\ConfigurableDynamicHelper` and call `addBlock()`. The method takes 5 parameter:  
1. The dynamicDataId that you set on your wrapper block. E.g.: `product_attributes`
2. The blockId of the block you want to show dynamically. E.g.: `product.attributes`
3. The class of the block. E.g.: `\Andering\ConfigurableDynamic\Block\Product\View\Attributes::class`
4. The config array.
5. The simple product.

##### *credits:*
[stachexchange](http://magento.stackexchange.com/questions/130128/magento-2-why-do-sku-not-change-dynamically-in-configurable-product-view-page/130148)

