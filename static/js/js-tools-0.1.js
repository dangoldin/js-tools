// From http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

function CSVToArray( strData, strDelimiter ){
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);

	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;

	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){
		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];
		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)
			){
			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push( [] );
		}

		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			var strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
				);
		} else {
			// We found a non-quoted value.
			var strMatchedValue = arrMatches[ 3 ];
		}

		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}

	// Return the parsed data.
	return( arrData );
}

$(document).ready(function(){
	console.log('Ready!');

	$('#id-form-table-conversion').submit(function(event){
		var content = $('#id-textarea').val(),
				has_header = $('#id-checkbox').is(':checked'),
				delimiter_val = $('input[name="radio-delimiter"]:checked').val(),
				delimiter_options = { space: ' ', tab: '\t', comma: ','},
				delimiter = delimiter_options[delimiter_val],
				table = '<table class="table">';

		if (!content) {
			event.preventDefault();
			return;
		}

		var data = CSVToArray(content, delimiter);

		console.log('Delim: ' + delimiter);
		console.log(has_header);
		console.log(data);

		if (has_header) {
			table += '<thead>';
		} else {
			table += '<tbody>';
		}

		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			table += '<tr>';
			for (var j = 0; j < row.length; j++) {
				var val = row[j].replace(/& /g, '&amp; ');
				if (has_header && i == 0) {
					table += '<th>' + val + '</th>';
				} else {
					table += '<td>' + val + '</td>';
				}
			}
			table += '</tr>';

			if (has_header && i == 0) {
				table += '</thead><tbody>';
			}

		}
		table += '</tbody></table>';

		$('#id-table').html(table);

		var table_code = document.createTextNode(table);
		$('#id-table-code').html('');
		$('#id-table-code').append(table_code);

		$('#id-table-generation-out').show();

		event.preventDefault();
	});
});