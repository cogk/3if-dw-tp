<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" />

    <xsl:template match="/">
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>Pays du monde</title>
            </head>

            <body style="background-color: white;">
                <h1>Les pays du monde</h1>

                <xsl:apply-templates select="//metadonnees" />

                <hr />
                <hr />

                <p>
                    Pays avec 6 voisins :
                    <xsl:for-each select="//country[count(borders/neighbour) = 6]">
                        <xsl:if test="not(position() = 1)">, </xsl:if>
                        <xsl:value-of select="name/common" />
                    </xsl:for-each>
                </p>

                <p>
                    Pays ayant le plus de voisins :
                    <!-- On suppose qu'il n'y a qu'un seul pays comme ça -->
                    <xsl:for-each select="//country">
                        <xsl:sort select="count(borders/neighbour)" data-type="number" order="descending"/>
                        <xsl:if test="position() = 1"><xsl:call-template name="country-with-most-neighbours"/></xsl:if>
                    </xsl:for-each>
                </p>

                <hr style="margin: 16px 0;" />

                <xsl:for-each select="//country/infosContinent/continent[not(preceding::continent = .) and not(. = '')]">
                    <xsl:variable name="continent" select="." />

                    <h3>Pays du continent : <xsl:value-of select="$continent" /> par sous-régions :</h3>

                    <xsl:for-each select="//country/infosContinent[continent=$continent]/subregion[not(preceding::subregion = .) and (../continent = current())]">
                        <xsl:variable name="subregion" select="." />
                        <xsl:call-template name="print-subregion">
                            <xsl:with-param name="continent" select="$continent" />
                            <xsl:with-param name="subregion" select="$subregion" />
                        </xsl:call-template>
                    </xsl:for-each>

                    <br />
                </xsl:for-each>
                <br />
            </body>
        </html>
    </xsl:template>

    <xsl:template match="metadonnees">
        <p style="text-align: center; color: blue;">
            <b>Mise en forme par : Zineb FADILI, Corentin FORLER (B3424)</b>
            <br />
            Objectif :
            <xsl:value-of select="objectif" />
        </p>
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
                    <br />
                    <span style="color:blue">Nom anglais : <xsl:value-of select="name/native_name[@lang='eng']/official" /></span>
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
                            <xsl:if test="not(position() = 1)">, </xsl:if>
                            <xsl:value-of select="//country[codes/cca3=current()]/name/common" />
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

    <xsl:template name="print-subregion">
        <xsl:param name="continent" />
        <xsl:param name="subregion" />
        <h4><xsl:value-of select="$subregion" /> (<xsl:value-of select="count(//country[infosContinent/continent=$continent][infosContinent/subregion=$subregion])" /> pays)</h4>

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
                <xsl:apply-templates select="//country[infosContinent/continent=$continent][infosContinent/subregion=$subregion]" />
            </tbody>
        </table>
    </xsl:template>

    <xsl:template name="country-with-most-neighbours">
        <xsl:value-of select="name/common" />, nob de voisins : <xsl:value-of select="count(borders/neighbour)" />
    </xsl:template>
</xsl:stylesheet>
