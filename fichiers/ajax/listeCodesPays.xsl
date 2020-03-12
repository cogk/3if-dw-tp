<?xml version="1.0"?>

<xsl:stylesheet version  ="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- ce template permet de générer un code html avec la liste des codes des pays -->
    <xsl:output method="html" />


	<xsl:template match="/">
		<html>
			<datalist id="liste-codes-pays">
				<xsl:apply-templates select="//country" />
			</datalist>
		</html>
	</xsl:template>
	
	<xsl:template match="//country">
		<option value="{codes/cca3}"><xsl:value-of select="codes/cca3" /> - <xsl:value-of select="name/official" /></option>
	</xsl:template>
</xsl:stylesheet>