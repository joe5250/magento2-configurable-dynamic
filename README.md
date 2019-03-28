# magento2-configurable-sku-switch

### Status

Tested by me on magento 2.1.3 (blank theme), works also on Magento 2.2

Do not expect this module to be updated/bugg fixed/altered for any specific magento version

### Purpose
Chagen sku for configurable on frontend to show the sku for selected product

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

##### *credits:*
[stachexchange](http://magento.stackexchange.com/questions/130128/magento-2-why-do-sku-not-change-dynamically-in-configurable-product-view-page/130148)

