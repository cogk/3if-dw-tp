<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" />

    <xsl:template match="/">
        <html>
            <head>
                <title>Pays du monde</title>
            </head>

            <body style="background-color:white;">
                <h1>Les pays du monde</h1>
                Mise en forme par : Zineb FADILI, Corentin FORLER (B3424)

                <table border="3" width="100%" align="center">
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Nom</th>
                            <th>Capitale</th>
                            <th>Voisins</th>
                            <th>Coordonnées</th>
                            <th>Drapeau</th>
                         </tr>
                    </thead>
                    <tbody>
                        <xsl:apply-templates select="//country[infosContinent/continent='Americas']" />
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="metadonnees">
        <p style="text-align:center; color:blue;">
            Objectif :
            <xsl:value-of select="objectif" />
        </p>
        <hr />
    </xsl:template>

    <xsl:template match="country">
        <tr>
            <td>
                <xsl:value-of select="position()" />
            </td>
            <td>
                <span style="color: green;">
                    <xsl:value-of select="name/common" />
                </span>
                (<xsl:value-of select="name/official" />)
                <xsl:if test="name/native_name[@lang='eng']">
                    <span style="color:blue">Nom anglais : <xsl:value-of select="name/native_name[@lang='eng']/common" /></span>
                </xsl:if>
            </td>

            <td>
                <xsl:value-of select="capital" />
            </td>

            <td>
                <xsl:variable name="n" select="count(borders/neighbour)"/>
                <xsl:choose>
                    <xsl:when test="$n = 0">
                        Île
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:for-each select="borders/neighbour">
                        <xsl:variable name="i" select="position()"/>
                        <xsl:value-of select="//country[codes/cca3=current()]/name/common" />
                        <xsl:if test="not($i = $n)">, </xsl:if>
                    </xsl:for-each>
                    </xsl:otherwise>
                </xsl:choose>
            </td>

            <td>
                <xsl:apply-templates select="coordinates" />
            </td>

            <td>
                <img src="http://www.geonames.org/flags/x/{translate(codes/cca2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')}.gif" alt="" height="40" width="60" />
            </td>
        </tr>
    </xsl:template>

    <xsl:template match="coordinates">
        Latitude : <xsl:value-of select="@lat" /><br />
        Longitude : <xsl:value-of select="@long" />
    </xsl:template>
</xsl:stylesheet>
