<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- ce template permet d'obtenir les informations liés aux pays saisi dans le champ de texte -->
	<xsl:param name="codePays" /> 
	
	<xsl:template match="/">
	<HTML>
	<BODY bgcolor="#FFFFCC">
	<UL>
		<p STYLE="font-weight:bold"> Informations sur le pays recherché : </p>
		<p>
			<span STYLE="font-weight:bold"> Official name : </span>
			<xsl:value-of select="//country[codes/cca3=$codePays]/name/official" />
		</p>
		<p>
			<span STYLE="font-weight:bold"> Capital : </span>
			<xsl:value-of select="//country[codes/cca3=$codePays]/capital" />
		</p>
	</UL>
	</BODY>
	</HTML>
	</xsl:template>
		
</xsl:stylesheet>