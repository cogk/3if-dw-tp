<?xml version="1.0"?>

<xsl:stylesheet version  ="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- ce template permet d'obtenir les informations liés aux pays parcours à travers la Map -->
	<xsl:param name="codePays" /> 
	
	<xsl:template match="/">
	<HTML>
	<BODY bgcolor="#FFFFCC">
	<H1>Results of search</H1>
	<UL>
		<table border="3" width="100%" align="center">
			<thead>
				<tr>
					<th>Nom : </th>
					<th>Capitale : </th>
					<th>Drapeau : </th>
					<th id="resultat-monnaie-th" style="display: none;">Monnaie : </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<xsl:value-of select="//country[codes/cca2=$codePays]/name/official" />
					</td>
					<td>
						<xsl:value-of select="//country[codes/cca2=$codePays]/capital" />
					</td>
					<td>
						<img src="http://www.geonames.org/flags/x/{translate(//country[codes/cca2=$codePays]/codes/cca2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')}.gif" alt="" height="40" width="60" />
					</td>
					<td id="resultat-monnaie" style="display: none;"><xsl:value-of select="//country[codes/cca2=$codePays]/currency" /></td>
				</tr>
			</tbody>
		</table>
	</UL>
	</BODY>
	</HTML>
	</xsl:template>
		
</xsl:stylesheet>