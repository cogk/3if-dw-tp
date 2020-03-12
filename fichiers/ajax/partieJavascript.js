//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//récupère le premier noeud enfant
function recupererPremierEnfantDeTypeNode(n) {
    var x = n.firstChild;
    while (x.nodeType != 1) { // Test if x is an element node (and not a text node or other)
        x = x.nextSibling;
    }
    return x;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change le contenu de l'élement avec l'id "nom" avec la chaine de caractéres en paramètre
function setNom(elementId, nom) {
    var elementHtmlARemplir = window.document.getElementById(elementId);
    elementHtmlARemplir.innerHTML = nom;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge le fichier XML se trouvant à l'URL relative donné dans le paramètre et le retourne
function chargerHttpXML(xmlDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3° paramètre est défini à false)
    httpAjax.open('GET', xmlDocumentUrl, false);
    httpAjax.send();

    return httpAjax.responseXML;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Charge le fichier JSON se trouvant à l'URL donnée en paramètre et le retourne
function chargerHttpJSON(jsonDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/json');
    }

    // chargement du fichier JSON à l'aide de XMLHttpRequest synchrone (le 3° paramètre est défini à false)
    httpAjax.open('GET', jsonDocumentUrl, false);
    httpAjax.send();

    var responseData = eval("(" + httpAjax.responseText + ")");

    return responseData;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge fichier xml, lui applique le xsl et remplace un element dans le html
function Bouton_ajaxBibliographie(xmlDocumentUrl, xslDocumentUrl, idParentRemplacement, newElementName, codePays) {

    var xsltProcessor = new XSLTProcessor();

    // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone
    var xslDocument = chargerHttpXML(xslDocumentUrl);

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);
	if (codePays != undefined) {
		xsltProcessor.setParameter(null, "codePays", codePays);
	}

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Création du document XML transformé par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(idParentRemplacement);
    // Premier élément fils du parent
    var elementHtmlARemplacer = recupererPremierEnfantDeTypeNode(elementHtmlParent);
    // Premier élément "elementName" du nouveau document (par exemple, "ul", "table"...)
    var elementAInserer = newXmlDocument.getElementsByTagName(newElementName)[0];

    // Remplacement de l'élément
    elementHtmlParent.replaceChild(elementAInserer, elementHtmlARemplacer);

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change le couleur de fond de la page
function bouton_changerCouleurFond(couleur) {
	// modifie la couleur du fond de la page selon le paramètre
	document.body.style.backgroundColor = couleur;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change la couleur de l'écriture sur le bouton
function bouton_changerEcritureBouton(bouton, couleur) {
	//modifie la couleur d'écriture du bouton passé en paramèter
	bouton.style.color = couleur;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge et affiche un fichier svg
function bouton_chargeEtAfficheSVG(id, url) {
	//récupération du fichier svg en tant que fichier xml
	var svgAsXml = chargerHttpXML(url);

	//serialisation du fichier xml
	var svg = new XMLSerializer().serializeToString(svgAsXml.documentElement);

	//remplace code html de l'élément pour que le svg s'affiche
	var element = document.getElementById(id);
	element.innerHTML = svg;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// rend clickage un svg et affiche des informations lors du click
function bouton_rendClickable(id) {
	//récupère element à rendre clickabe
	var svgFormes = document.getElementById(id);

	var tagG = svgFormes.getElementsByTagName('g');
	var lesformes = tagG[0].children; //on recupere les enfant de g
	for (const child of lesformes) {
		//distinction des cas : svg de formes ou svg de map
		if (id == "svgfichier") {
			var attrib = "title";
			var titre = "Nom de la forme cliquée :";
		} else {
			var attrib = "countryname";
			var titre = "Nom du pays cliqué :";
		}
		//ajout d'une gestion d'évenement correspondant du click de la souris : affichage des informations demandées
		child.addEventListener("click", function() {setNom("id_titre_a_remplacer", titre); setNom("id_nom_a_remplacer", child.getAttribute(attrib)); });
	}

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//modifie les informations affichés pour la map : ajout de la monnaie si en mode MODE_CARTE_MONNAIE
const MODE_CARTE_NORMAL = 0;
const MODE_CARTE_MONNAIE = 1;
var modeCarte = MODE_CARTE_NORMAL;

function bouton_changerModeCarte(nouveauModeCarte) {
	modeCarte = nouveauModeCarte;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//formate les informations liés au pays de la carte passé en paramètre
function formatterResultatCarte(child) {
	var resultsId = 'id_resultats_recherche';
	Bouton_ajaxBibliographie('countriesTP.xml', 'caraPays.xsl', resultsId, 'ul', child.getAttribute("id"));

	//on souhaite afficher la monnaie utilisée (bouton 10)
	if (modeCarte === MODE_CARTE_MONNAIE) {
		var monnaieElement = document.getElementById('resultat-monnaie')

		//récupération du nom de la monnaie
		var monnaie = monnaieElement.innerHTML.toLowerCase();
		var urlApi = 'https://restcountries.eu/rest/v2/currency/' + monnaie;

		monnaieElement.style.display = '';
		document.getElementById('resultat-monnaie-th').style.display = '';

		try {
			var json = chargerHttpJSON(urlApi);
			var pays = json[0]; // on récupère un pays quelconque qui utilise cette monnaie.

			// On cherche notre monnaie dans la liste de toutes les monnaies utilisée par ce pays quelconque.
			var nomCompletMonnaie = '?';
			for (var i = 0; i < pays.currencies.length; i++) {
				var m = pays.currencies[i];
				if (m.code.toLowerCase() === monnaie) {
					nomCompletMonnaie = m.name + ' (' + m.symbol + ')';
					break;
				}
			}

			monnaieElement.innerHTML = nomCompletMonnaie;
		} catch (e) {}
	}

	child.style.fill = '#99ffa8';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//pas d'informations sur le pays affiché
function effacerResultatCarte(child) {
	// Bouton_ajaxBibliographie('countriesTP.xml', 'caraPays.xsl', 'id_resultats_recherche', 'ul', 'NOCOUNTRY');
	document.getElementById('id_resultats_recherche').innerHTML = "<div>Veuillez passer votre souris sur un pays pour voir plus d'informations.</div>";
	child.style.fill = '#CCCCCC';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//gestion des mouvements de la souris sur la carte
function bouton_ajoutActListCarte(id) {
	var svgFormes = document.getElementById(id);
	var tagG = svgFormes.getElementsByTagName('g');
	var lesformes = tagG[0].children; // on recupere les enfant de g

	for (const child of lesformes) {
		//deux cas : la souris est sur le pays, ou la souris a quitté le pays
		child.addEventListener("mouseover", function() {
			formatterResultatCarte(child)
		});
		child.addEventListener("mouseleave", function() {
			effacerResultatCarte(child)
		});
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//activation de la fonction autocomplétion du champs de texte
function bouton_activerAutoCompletion(textInputId, datalistId) {
    var xsltProcessor = new XSLTProcessor();

    // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone
    var xslDocument = chargerHttpXML('listeCodesPays.xsl');

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone
    var xmlDocument = chargerHttpXML('countriesTP.xml');

    // Création du document XML transformé par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    var datalist = document.getElementById(datalistId);

	//ajout de chaque pays a la liste qui sera proposé à l'utilisateur lors du remplissage du champ
    var children = newXmlDocument.getElementsByTagName('option');
	for (const child of children) {
		datalist.appendChild(child);
	}

	var textInput = document.getElementById(textInputId);
	textInput.setAttribute('list', datalistId);
	textInput.setAttribute('autocomplete', 'on');
}


// les deux couleurs du dégradé définies selon le format HSL
const COULEUR_1 = [200, 100, 80]
const COULEUR_2 = [340, 100, 50]

// Une fonction pour "mélanger" deux nombres
function melangerNombres(proportion, a, b) {
    return (1 - proportion) * a + proportion * b;
}

// Une fonction utilitaire pour obtenir des couleurs
// à partir d'une valeur numérique seule
// Une sorte de dégradé
// [0; 1] --> couleur
//
// ATTENTION: les couleurs générées ne correspondent pas à un modèle perceptuel de la couleur
// donc elles ne correspondent pas exactement aux couleurs du dégradé
// mais sont suffisamment proches donc pas de gros problème
// https://en.wikibooks.org/wiki/Color_Theory/Color_gradient
function couleurPourProportion(x) {
	const h = melangerNombres(x, COULEUR_1[0], COULEUR_2[0]);
	// const s = (0.5 + 2 * (x - 0.5) * (x - 0.5)) * 100;
	const s = 100 - 50 * Math.abs(x - 0.25); // légère correction des couleurs
	const l = melangerNombres(x, COULEUR_1[2], COULEUR_2[2]);
	return 'hsl(' + h + 'deg, ' + s + '%, ' + l + '%)';
}

// Fonctions à propos de l'infobulle des monuments
const infobulle = document.getElementById('monuments-info-bulle');
function definirContenuInfoBulle(results) {
    if (results === null) {
        infobulle.innerHTML = 'Chargement…';
    } else {
        if (results.length === 0) {
            infobulle.innerHTML = 'Aucun monument dans la base de données';
        } else {
            infobulle.innerHTML = results.length + ' monument' + (results.length > 1 ? 's' : '') + ' (cliquez pour voir la liste)';
        }
    }
}
function afficherInfoBulle(event) {
    const x = event.clientX + 16
    const y = event.clientY - 8
    infobulle.style.visibility = 'visible';
    infobulle.style.left = x + 'px';
    infobulle.style.top = y + 'px';
}
function masquerInfoBulle() {
    infobulle.style.visibility = 'hidden';
}

// Coloration du pays selon le nombre de monuments
function colorPays(child, results) {
    // on récupère le nombre de monuments entre 0 et 54
	const n = Math.max(0, Math.min(54, results.length));
	const x = n / 54;
	child.style.fill = couleurPourProportion(x);
	child.style.transition = 'all 200ms ease';
}


const modalMonuments = document.getElementById('monuments-modal');
const modalMonumentsContent = document.getElementById('monuments-modal-content');
function afficherListeMonuments(nomPays, url, results) {
    modalMonuments.classList.remove('hidden');

    let html = '';
    html += '<h3>Pays : ' + nomPays + '</h3>';

    if (results.length) {
        // On crée une table
        html += '<table border="1" width="100%" style="text-align: left;">';
        html += '<tr>' + ['Nom du monument', 'Région', 'Latitude', 'Longitude'].map((s) => '<th>' + s + '</th>').join('') + '</tr>';

        for (const tr of results) {
            // Pour chaque ligne du tableau du site geonames
            // on adapte le contenu pour notre propre usage

            // On récupère le lien qui contient le nom du monument
            const a = tr.children[1].getElementsByTagName('a')[0];

            // On récupère l'élément <small> qui contient une description précise du monument
            const small = tr.children[1].getElementsByTagName('small')[0];

            // On assemble les deux informations précédentes dans une seule variable
            const nom = '<span style="color: #936">' + a.innerHTML + '</span>' + '<br /><small><i>' + small.innerText + '</i></small>';

            // On récupère la région (Pays, région)
            const reg = tr.children[2].innerHTML;

            // La latitude et longitude
            const lat = tr.children[4].innerHTML;
            const lon = tr.children[5].innerHTML;

            // Enfin on regroupe toutes ces informations dans une ligne de tableau
            html += '<tr>' + [nom, reg, lat, lon].map(s => '<td>' + s + '</td>').join('') + '</tr>';
        }

        html += '</table>';

        html += '<br />';
        html += 'Source des données :<br /><a target="_blank" href="' + url + '">' + url + '</a>';
    } else {
        html += '<b style="color: red;">Aucun monument dans la base de données.</b><br />';
    }
    html += '<br />';
    html += '<br />';
    html += '<br />';

    modalMonumentsContent.innerHTML = html;
}
function masquerListeMonuments() {
    modalMonuments.classList.add('hidden');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//activation de la visualisation intéressante : nombre de monument par pays avec un gradient pour se repérer. données issues du site geonames
function bouton_visualisationInteressante() {
	//création et affichage du gradient pour se repérer dans la carte
	var contientGrad = document.getElementById("leGradient");
	contientGrad.style.display = '';

    // On affiche un dégradé qui est la légende de la carte
    // pour le nombre de monuments
	var canvas = document.getElementById("unGradient");
	var contexte = canvas.getContext("2d");

	var gradient = contexte.createLinearGradient(0, 0, 200, 0);
    // gradient.addColorStop(0, couleurPourProportion(0));
    // gradient.addColorStop(1, couleurPourProportion(1));
    // Malheureusement le dégradé ne correspond pas aux couleurs données
    // par la fonction couleurPourProportion(x) pour des x entre 0 et 1
    // à cause des problèmes notés en commentaire au-dessus de la
    // définition de cette fonction.
    for (let i = 0; i <= 10; i++) {
        const x = i / 10;
        gradient.addColorStop(x, couleurPourProportion(x));
    }
	contexte.fillStyle = gradient;
	contexte.fillRect(0, 0, 200, 50);



	// Chargement de la carte
	var id = 'svgfichierVisualisation';
	bouton_chargeEtAfficheSVG(id, 'worldHigh.svg');

	var svg = document.getElementById(id);
	var tagG = svg.getElementsByTagName('g');
	var paysSvg = tagG[0].children; // on recupere les enfant de g

	for (const child of paysSvg) {
		const codePays = child.getAttribute("id").toLowerCase();
		const url = 'https://www.geonames.org/advanced-search.html?q=monument&country=' + codePays.toUpperCase() + '&featureClass=S&continentCode=';

		let results = null;
		let hovered = false;

		child.addEventListener("mouseover", function(event) {
			hovered = true;

			//on ne recharge le nombre de monument que si on n'est pas encore passé sur le pays
			if (results === null) {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        const content = request.responseText;
                        const doc = new DOMParser().parseFromString(content, "text/html");

                        // Il y a des résultats s'il n'y a pas de message d'erreur dans la page chargée
                        // En effet, geonames.org affiche des résultats depuis Wikipédia
                        // s'il n'y a pas de momument dans sa propre base de données
                        // sauf que ces résultats sont mauvais.
                        const hasResults = doc.body.querySelectorAll('#search > font[color="red"] > small').length === 0;

                        if (hasResults) {
                            results = doc.body.querySelectorAll('#search > table tr:not(:first-child):not(:nth-child(2)):not(:last-child)');
                        } else {
                            results = [] // Aucun résultat dans la base de données
                        }

                        if (hovered) {
                            colorPays(child, results);
                            definirContenuInfoBulle(results);
                        }
                    }
                };
                request.send();
			} else {
				colorPays(child, results);
			}

            // chargé ou pas, on affiche l'infobulle
            afficherInfoBulle(event);
            definirContenuInfoBulle(results);
		});
		child.addEventListener("mouseleave", function() {
			hovered = false;
			child.style.fill = '#CCCCCC';
            child.style.transition = 'none';
            masquerInfoBulle();
		});
		child.addEventListener("mousemove", function(event) {
            afficherInfoBulle(event);
            definirContenuInfoBulle(results);
		});
		child.addEventListener("click", function() {
            if (results !== null) {
                afficherListeMonuments(child.getAttribute("countryname"), url, results);
            }
		});
	}
}
