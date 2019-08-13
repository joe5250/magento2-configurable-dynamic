<?php
/**
 * Created by PhpStorm.
 * User: thomasnordkvist
 * Date: 17-01-30
 * Time: 08:15
 */

namespace Andering\ConfigurableDynamic\Plugin\Magento\ConfigurableProduct\Block\Product\View\Type;

use Andering\ConfigurableDynamic\Block\Product\View\Attributes;
use Andering\ConfigurableDynamic\Helper\ConfigurableDynamicHelper;
use Magento\Catalog\Model\Product;

class Configurable
{

    private $dynamicHelper;

    public function __construct(ConfigurableDynamicHelper $dynamicHelper)
    {
        $this->dynamicHelper = $dynamicHelper;
    }

    public function afterGetJsonConfig(\Magento\ConfigurableProduct\Block\Product\View\Type\Configurable $subject, $result) {

        $jsonResult = $this->dynamicHelper->unserialize($result);

        foreach ($subject->getAllowProducts() as $simpleProduct) {
            $jsonResult = $this->addVisibleAttributes($simpleProduct, $jsonResult);
            $jsonResult = $this->dynamicHelper->addBlock(
        	    'product_attributes',
                'product.attributes',
                Attributes::class,
                $jsonResult,
                $simpleProduct
                );
        	$jsonResult = $this->addProductName($jsonResult, $simpleProduct);
        }

        $result = $this->dynamicHelper->serialize($jsonResult);
        return $result;
    }

    private function addProductName(array $config, Product $product): array
    {
        $config['dynamic']['product_name'][$product->getId()] = [
            'value' => $product->getName(),
        ];

        return $config;
    }

    private function addVisibleAttributes(Product $simpleProduct, $jsonResult)
    {
        foreach ($simpleProduct->getAttributes() as $attribute) {
            if (($attribute->getIsVisible() && $attribute->getIsVisibleOnFront()) || in_array($attribute->getAttributeCode(),
                    ['sku', 'description'])) {
                $code = $attribute->getAttributeCode();
                $value = (string)$attribute->getFrontend()->getValue($simpleProduct);
                $jsonResult['dynamic'][$code][$simpleProduct->getId()] = [
                    'value' => $value
                ];
            }
        }

        return $jsonResult;
}
}
