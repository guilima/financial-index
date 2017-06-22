<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	//http://charlescorrea.com.br/blog/postagens/capturando-cotacoes-de-moedas-diretamente-do-banco-central-do-brasil-com-php
	header('Content-type: text/html; charset=UTF-8');
	$method = "getValoresSeriesXML";
	// vamos evitar que o arquivo WSDL seja colocado no cache
	ini_set("soap.wsdl_cache_enabled", "0");
	$client = new SoapClient("https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl", array("trace"=>1, 'encoding'=>'ISO-8859-1'));	
		
	try {
		$params = array (
			"arg0" => array(7845, 433),
			"arg1" => "21/01/2017",
			"arg2" => "21/05/2017"
		);
		
		$res  = $client->__soapCall($method, $params);
		$objPhp = simplexml_load_string($res);
		$json = json_encode( (array)$objPhp );
		//return $res;
	} catch (SoapFault $e) {
		echo "Error: {$e}";
	}
	//var_dump($client->__getFunctions());
	echo "<pre>", htmlspecialchars($client->__getLastResponse()), "</pre>";
?>
<html>
<head>
	<title>Indíces de valores financiais</title>
	<script>
		var res = '<?php echo $json ?>';
		res = JSON.parse(res);
		console.log(res);
		res.SERIE.forEach(serie => {
			console.log(serie['@attributes'].ID);
			serie.ITEM.forEach(item => {
				console.log(item.VALOR);
			});
		});
	</script>
</head>
<body>
	Hello World!
	
</body>
</html>