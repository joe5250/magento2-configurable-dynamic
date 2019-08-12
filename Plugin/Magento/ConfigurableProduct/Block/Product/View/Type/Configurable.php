<?php
/**
 * Created by PhpStorm.
 * User: thomasnordkvist
 * Date: 17-01-30
 * Time: 08:15
 */

namespace Andering\ConfigurableDynamic\Plugin\Magento\ConfigurableProduct\Block\Product\View\Type;

use Andering\ConfigurableDynamic\Block\Product\View\Attributes;
use Magento\Catalog\Model\Product;

class Configurable
{
    private $layout;

    public function __construct(\Magento\Framework\View\LayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    public function afterGetJsonConfig(\Magento\ConfigurableProduct\Block\Product\View\Type\Configurable $subject, $result) {

        $jsonResult = json_decode($result, true);

        foreach ($subject->getAllowProducts() as $simpleProduct) {
        	$id = $simpleProduct->getId();
        	foreach($simpleProduct->getAttributes() as $attribute) {
				if(($attribute->getIsVisible() && $attribute->getIsVisibleOnFront()) || in_array($attribute->getAttributeCode(), ['sku','description']) ) {
					$code = $attribute->getAttributeCode();
					$value = (string)$attribute->getFrontend()->getValue($simpleProduct);
					$jsonResult['dynamic'][$code][$id] = [
						'value' => $value
					];
				}
        	}

            $jsonResult = $this->addSimpleAttributesBlock($simpleProduct, $jsonResult, $id);
        }

        $result = json_encode($jsonResult);
        return $result;
    }

    private function addSimpleAttributesBlock(Product $simpleProduct, $jsonResult, int $id)
    {
        $jsonResult['dynamic']['product_attributes'][$id] = [
            'value' => $this->getProductAttributesBlockHtml($simpleProduct),
        ];

        return $jsonResult;
    }

    private function getProductAttributesBlockHtml(Product $product)
    {
        /** @var Attributes $originalBlock */
        $originalBlock = $this->layout->getBlock('product.attributes');
        /** @var Attributes $block */
        $block = $this->layout->createBlock(Attributes::class, '', $originalBlock->getData());
        $block->setProduct($product);
        $block->setTemplate($originalBlock->getTemplate());

        return $block->toHtml();
    }
}
