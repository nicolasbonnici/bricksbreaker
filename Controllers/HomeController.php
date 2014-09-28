<?php
namespace bundles\bricksbreaker\Controllers;

/**
 *
 * @author info
 */
class HomeController extends \Library\Core\Auth
{

    public function __preDispatch()
    {

    }

    public function __postDispatch()
    {}

    public function indexAction()
    {
        $this->oView->render($this->aView, 'home/index.tpl');
    }
}


