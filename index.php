<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	header('Content-type: text/html; charset=UTF-8');
	$method = array(
		'getValoresSeriesXML',
		'getValor'
	);

	ini_set('soap.wsdl_cache_enabled', '0');
	$client = new SoapClient(
		'https://www3.bcb.gov.br/sgspub/JSP/sgsgeral/FachadaWSSGS.wsdl',
		array(
			'trace' => 1,
			'encoding' => 'ISO-8859-1'
		)
	);	
		
	try {
		$paramsGetValoresSeries = array (
			'arg0' => array(7845, 192, 189, 433, 4391),
			'arg1' => '21/01/2016',
			'arg2' => '21/05/2017'
		);
		$paramsGetValor = array (
			'arg0' => 7845,
			'arg1' => '21/12/2016'
		);
		
		$res  = $client->__soapCall($method[0], $paramsGetValoresSeries);
		$objPhp = simplexml_load_string($res);
		
		$json = json_encode( (array)$objPhp );
		$series = json_decode( $json );

		$res2  = $client->__soapCall($method[1], $paramsGetValor);
	} catch (SoapFault $e) {
		echo 'Error: {$e}';
	}
	//var_dump($client->__getFunctions());
	//echo "<pre>", htmlspecialchars($client->__getLastResponse()), "</pre>";
?>
<html>
	<head>
		<title>Indíces de valores financiais</title>
		<link rel="stylesheet" href="styles.css">
	</head>
	<body>
		<section>
			<h1>Índices Financeiros</h1>
			<div>
				<table cellpadding="0" cellspacing="0" border="0">
					<thead class="tbl-header" id="tbl-header">
						<tr id="tbl-header-tr">
							<th></td>
						</tr>
					</thead>
					<tbody class="tbl-content" id="tbl-body">
						<tr id="tr-data"></tr>
					</tbody>
				</table>
			</div>
		</section>
		<script>
		(function() {
			var c = <?php echo $res2 ?>;
			function ibovespaPercentage(value, notFirst) {
			    var numeric = Number(value),
					a = c,
					b = ( ( ( numeric * 100 ) / a ) - 100 ).toFixed(2);
					c = numeric;
					//console.log(`${b}% (${numeric})`);
					return `${b}% (${numeric})`;
			}
			var res = '<?php echo $json ?>';
			res = JSON.parse(res);
			console.log(res);
			res.SERIE.forEach(serie => {
				var title = function() {
					switch (serie['@attributes'].ID) {
						case '4391': return 'CDI';
						case '433': return 'IPCA';
						case '189': return 'IGP-M';
						case '192': return 'INCC';
						case '7845': return 'Ibovespa';
						default: return 'Nulo';
					}
				};
				var thElem = document.createElement("th"); 
				var addTitle = document.createTextNode(title()); 
				thElem.appendChild(addTitle);
				var thRow = document.getElementById("tbl-header-tr");
				thRow.appendChild(thElem);
				//console.log(title());

				var trElem = document.createElement("tr");
				var tbody = document.getElementById("tbl-body");
				tbody.appendChild(trElem);
				serie.ITEM.forEach( (item, index) => {
					if(serie['@attributes'].ID == 7845) {
						var t = ibovespaPercentage(item.VALOR, index);

						var tdDataElem = document.createElement("td"); 
						var trData = document.getElementById("tr-data");
						tdDataElem.appendChild(document.createTextNode(`${item.DATA}`));
						trData.appendChild(tdDataElem);
					} else {
						var t = `${item.VALOR}%`;
						//console.log(`${item.VALOR}%`);
					}
					var tdElem = document.createElement("td");
					var indexValue = document.createTextNode(t); 
					tdElem.appendChild(indexValue);
					trElem.appendChild(tdElem);
				});
			});
		})();
		</script>
	</body>
</html>