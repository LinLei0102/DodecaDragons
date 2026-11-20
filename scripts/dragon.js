//Unlocks dragon
function unlockDragon() {
  if (game.gold.gte(200)) {
    game.gold = game.gold.sub(200)
    document.getElementById("unlockDragonButton").style.display = "none"
    document.getElementById("unlockAlchemyButton").style.display = "block"
    document.getElementsByClassName("box")[3].style.display = "block"
    document.getElementsByClassName("resourceRow")[2].style.display = "block"
    addUnlock() //sets unlock to 1
  }
}

//Handles buying new dragon stages
function upgradeDragon(x) {
  if (x==1 && game.gold.gte(2500000)) {
    game.gold = game.gold.sub(2500000)
    document.getElementsByClassName("upgradeDragonButton")[0].style.display = "none"
    document.getElementsByClassName("upgradeDragonButton")[1].style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon2.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>成年龙"
    document.getElementById("dragonInfo").innerHTML = "你那庞大的龙之友令人敬畏又恐惧，还会为你喷吐火焰。"
    game.dragonStage = 2
  }
  else if (x==2 && game.gold.gte(1e12)) {
    game.gold = game.gold.sub(1e12)
    document.getElementsByClassName("upgradeDragonButton")[1].style.display = "none"
    document.getElementsByClassName("upgradeDragonButton")[2].style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon3.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>上古龙"
    document.getElementById("dragonInfo").innerHTML = "你强壮而睿智的龙之友栖息在你的金币山上，以炼狱般的吐息守护它。"
    game.dragonStage = 3
  }
  else if (x==3 && game.gold.gte(1e25)) {
    game.gold = game.gold.sub(1e25)
    document.getElementsByClassName("upgradeDragonButton")[2].style.display = "none"
    document.getElementsByClassName("upgradeDragonButton")[3].style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon4.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>暗龙"
    document.getElementById("dragonInfo").innerHTML = "你那凶恶的暗龙召唤虚空本身的力量来守卫你的帝国。"
    game.dragonStage = 4
  }
  else if (x==4 && game.gold.gte(1e150)) {
    game.gold = game.gold.sub(1e150)
    document.getElementsByClassName("upgradeDragonButton")[3].style.display = "none"
    document.getElementById("dragonImg").src = "img/iconDragon5.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>光龙"
    document.getElementById("dragonInfo").innerHTML = "你那圣洁的光龙汇聚诸神本身的力量来保护你的人民免受伤害。它还能从爪中射出闪电，因为它就是这么酷。"
    game.dragonStage = 5
    document.getElementById("dragonAffectionStuff").style.display = "block"
    document.getElementById("dragonTimeCooldown").innerHTML = game.dragonTimeCooldown
    document.getElementById("dragonTimeSpent").textContent = format(game.dragonTimeSpent, 0)
    game.dragonTimeEffect = new Decimal(1.2).pow(game.dragonTimeSpent.pow(0.3))
    if (game.dragonTimeEffect.gt(2)) game.dragonTimeEffect = game.dragonTimeEffect.add(2).pow(0.5)
    if (game.dragonTimeEffect.gt(2.5)) {
      game.dragonTimeEffect = new Decimal(2.5)
      document.getElementById("dragonTimeEffectCap").innerHTML = " （已达上限）"
    }
    else {document.getElementById("dragonTimeEffectCap").innerHTML = ""}
    document.getElementById("dragonTimeEffect").textContent = format(game.dragonTimeEffect, 3)
    if (game.dragonTimeCooldown > 0) {document.getElementById("dragonSpendTimeButton").disabled = true}
    else {document.getElementById("dragonSpendTimeButton").disabled = false}
    document.getElementById("dragonFeedCost").textContent = format(game.dragonFeedCost, 0)
    document.getElementById("dragonFood").textContent = format(game.dragonFood, 0)
    document.getElementById("dragonFoodEffect").textContent = format(new Decimal(1.3).pow(game.dragonFood), 3)
  }
  else if (x==5 && game.gold.gte("e1.5e11")) {
    document.getElementsByClassName("upgradeDragonButton")[4].style.display = "none"
    document.getElementsByClassName("upgradeDragonButton")[5].style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon6.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>机械龙"
    document.getElementById("dragonInfo").innerHTML = "尽管它体内充满了无边无际、不断向内盘旋的诡异科技，亿万微小齿轮悄然转动，你的龙却感觉自己也不过是个齿轮罢了。也许……它仍不完美。"
    game.dragonStage = 6
    document.getElementById("unlockBloodButton").style.display = "block"
  }
  else if (x==6 && game.gold.gte("e1e55")) {
    document.getElementsByClassName("upgradeDragonButton")[5].style.display = "none"
    document.getElementById("unlockVoidMagicUpgradesButton").style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon7.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>神圣龙"
    document.getElementById("dragonInfo").innerHTML = "你的龙引导无穷能量贯穿自身，是近乎无限力量的存在，连诸神都为之畏惧。我们是怎么走到这一步的？"
    game.dragonStage = 7
  }
  else if (x==7 && game.gold.gte("e1e200")) {
    document.getElementsByClassName("upgradeDragonButton")[6].style.display = "none"
		document.getElementById("unlockPlanetsButton").style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon8.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>多维龙"
    document.getElementById("dragonInfo").innerHTML = "你的龙能同时洞悉无数宇宙，并引导它们合二为一的全部力量。"
    game.dragonStage = 8
  }
	else if (x==8 && game.gold.gte("ee35000")) {
    document.getElementsByClassName("upgradeDragonButton")[7].style.display = "none"
    document.getElementById("dragonImg").src = "img/iconDragon9.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>瘟疫龙"
    document.getElementById("dragonInfo").innerHTML = "你的龙身上滴淌着泛宇宙中最危险的物质，完全无法被杀死。"
    game.dragonStage = 9
  }
	else if (x==9 && game.gold.gte("ee1.75e6")) {
    document.getElementsByClassName("upgradeDragonButton")[8].style.display = "none"
		document.getElementById("unlockNuclearPastaButton").style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon10.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>死亡龙"
    document.getElementById("dragonInfo").innerHTML = "你的龙化身为死亡本身。看来你已经杀死了死神，取而代之成为灵魂的收割者。"
    game.dragonStage = 10
  }
	else if (x==10 && game.gold.gte("ee1.5e9")) {
    document.getElementsByClassName("upgradeDragonButton")[9].style.display = "none"
		document.getElementById("unlockFinalityCubesButton").style.display = "block"
    document.getElementById("dragonImg").src = "img/iconDragon11.png"
    document.getElementById("dragonTitle").innerHTML = "<a style='font-size: 14px'>你拥有一条</a><br>终焉龙"
    document.getElementById("dragonInfo").innerHTML = "你的龙如今由泛宇宙本身的精华构成。从物理上讲，它已不可能变得更强。除非……？"
    game.dragonStage = 11
  }
  document.getElementById("dragonStageCounter").innerHTML = romanNumerals[game.dragonStage - 1]
}

//Spending time with your dragon
function dragonSpendTime() {
  if (game.dragonTimeCooldown == 0 && !game.challengesActive) {
    let dragonTimeToGet = new Decimal(1 + Math.floor((Date.now() - game.lastUpdate) / 30000));
    if (game.darkMagicUpgradesBought[2]) {dragonTimeToGet = dragonTimeToGet.mul(10)}
    if (game.unlocks >= 12) dragonTimeToGet = dragonTimeToGet.mul(new Decimal(2).pow(game.indigoSigilUpgradesBought[2].pow(0.6)))
    game.dragonTimeSpent = game.dragonTimeSpent.add(dragonTimeToGet.floor())
    game.dragonTimeCooldown = 30
    document.getElementById("dragonSpendTimeButton").disabled = true
    document.getElementById("dragonTimeCooldown").innerHTML = game.dragonTimeCooldown
    document.getElementById("dragonTimeSpent").textContent = format(game.dragonTimeSpent, 0)
    game.dragonTimeEffect = new Decimal(1.2).pow(game.dragonTimeSpent.pow(0.3))
    if (game.dragonTimeEffect.gt(2)) game.dragonTimeEffect = game.dragonTimeEffect.add(2).pow(0.5)
    dragonTimeEffectCap = new Decimal(2.5)
    if (game.tomeUpgradesBought[8] == true) dragonTimeEffectCap = dragonTimeEffectCap.mul(game.blueFireUpgradesBought[4].pow(0.7).div(5).add(1))
    if (game.unlocks >= 26) dragonTimeEffectCap = dragonTimeEffectCap.mul(game.holyFireUpgradesBought[2].pow(0.7).mul(5).add(1))
		if (game.voidMagicUpgradesBought[8] == true) dragonTimeEffectCap = dragonTimeEffectCap.mul(10000)
    if (game.dragonTimeEffect.gt(dragonTimeEffectCap)) {
      game.dragonTimeEffect = dragonTimeEffectCap
      document.getElementById("dragonTimeEffectCap").innerHTML = " （已达上限）"
    }
    else {document.getElementById("dragonTimeEffectCap").innerHTML = ""}
    document.getElementById("dragonTimeEffect").textContent = format(game.dragonTimeEffect, 3)
  }
}

//Feeding your dragon
function dragonFeed() {
  if (game.magifolds.gte(game.dragonFeedCost) && !game.challengesActive) {
    if (game.unlockedAchievements[10] > 0) {
      maxDragonFeedsBuyable = new Decimal(game.magifolds).log10().log10().div(0.301).sub(3).floor().add(1)
     // game.dragonFood = game.dragonFood.add(maxDragonFeedsBuyable);
      game.dragonFood = Decimal.max(game.dragonFood, maxDragonFeedsBuyable)
      game.dragonFeedCost = new Decimal(10).pow(new Decimal(2).pow(game.dragonFood).mul(8).round());
    }
    else {
      game.dragonFood = game.dragonFood.add(1);
      game.dragonFeedCost = new Decimal(10).pow(new Decimal(2).pow(game.dragonFood).mul(8).round());
    }
    document.getElementById("dragonFeedCost").textContent = format(game.dragonFeedCost, 0);
    document.getElementById("dragonFood").textContent = format(game.dragonFood, 0);
    document.getElementById("dragonFoodEffect").textContent = format(new Decimal(1.3).pow(game.dragonFood), 3);
    //Resetting all the score and magifold stuff
    if (game.unlockedAchievements[7] > 0) {
      //do nothing :D
    } else if (game.unlockedAchievements[6] > 1) {
      game.magicScore1 = game.magicScore1.sqrt();
      game.magicScore2 = game.magicScore2.sqrt();
      game.magicScore3 = game.magicScore3.sqrt();
      game.magicScore4 = game.magicScore4.sqrt();
    } else {
      game.magicScore1 = new Decimal(0)
      game.magicScore2 = new Decimal(0)
      game.magicScore3 = new Decimal(0)
      game.magicScore4 = new Decimal(0)
    }
    document.getElementById("magicScore1").textContent = format(game.magicScore1, 0)
    document.getElementById("magicScore2").textContent = format(game.magicScore2, 0)
    document.getElementById("magicScore3").textContent = format(game.magicScore3, 0)
    document.getElementById("magicScore4").textContent = format(game.magicScore4, 0)
    document.getElementById("magicMult1").textContent = format(game.magicScore1.add(1), 0)
    document.getElementById("magicMult2").textContent = format(game.magicScore2.add(1), 0)
    document.getElementById("magicMult3").textContent = format(game.magicScore3.add(1), 0)
    document.getElementById("magicMult4").textContent = format(game.magicScore4.add(1), 0)
    
    if (game.inHell) {game.magifolds = new Decimal(1)}
    else {game.magifolds = game.magicScore1.add(1).mul(game.magicScore2.add(1)).mul(game.magicScore3.add(1)).mul(game.magicScore4.add(1))}
    document.getElementById("magifolds").textContent = format(game.magifolds, 0)
    if (game.darkMagicUpgradesBought[3]) {document.getElementById("magifoldEffect").textContent = format(game.magifolds.pow(8), 2)}
    else if (game.magicUpgradesBought[18]) {document.getElementById("magifoldEffect").textContent = format(game.magifolds.pow(6), 2)}
    else {document.getElementById("magifoldEffect").textContent = format(game.magifolds.pow(4), 2)}
    document.getElementsByClassName("resourceText")[5].textContent = format(game.magifolds, 0)
  }
}

//Petting your dragon
//This code could probably be shortened a lot!
function dragonPet() {
  if (game.dragonPets == 0 && game.cyanSigils.gte(250)) {
    game.cyanSigils = game.cyanSigils.sub(250)
    game.dragonPets++
    document.getElementById("dragonPetRequirement").innerHTML = "blue"
    document.getElementById("dragonPets").innerHTML = game.dragonPets
    document.getElementById("dragonPetEffect").textContent = format(new Decimal(5).pow(game.dragonPets ** 0.5), 2)
  }
  else if (game.dragonPets == 1 && game.blueSigils.gte(250)) {
    game.blueSigils = game.blueSigils.sub(250)
    game.dragonPets++
    document.getElementById("dragonPetRequirement").innerHTML = "indigo"
    document.getElementById("dragonPets").innerHTML = game.dragonPets
    document.getElementById("dragonPetEffect").textContent = format(new Decimal(5).pow(game.dragonPets ** 0.5), 2)
  }
  else if (game.dragonPets == 2 && game.indigoSigils.gte(250)) {
    game.indigoSigils = game.indigoSigils.sub(250)
    game.dragonPets++
    document.getElementById("dragonPetRequirement").innerHTML = "violet"
    document.getElementById("dragonPets").innerHTML = game.dragonPets
    document.getElementById("dragonPetEffect").textContent = format(new Decimal(5).pow(game.dragonPets ** 0.5), 2)
  }
  else if (game.dragonPets == 3 && game.violetSigils.gte(250)) {
    game.violetSigils = game.violetSigils.sub(250)
    game.dragonPets++
    document.getElementById("dragonPetRequirement").innerHTML = "pink"
    document.getElementById("dragonPets").innerHTML = game.dragonPets
    document.getElementById("dragonPetEffect").textContent = format(new Decimal(5).pow(game.dragonPets ** 0.5), 2)
  }
  else if (game.dragonPets == 4 && game.pinkSigils.gte(250)) {
    game.pinkSigils = game.pinkSigils.sub(250)
    game.dragonPets++
    document.getElementById("dragonPetButton").innerHTML = "你已经充分抚摸过你的龙了。"
    document.getElementById("dragonPetButton").disabled = true
    document.getElementById("dragonPets").innerHTML = game.dragonPets
    document.getElementById("dragonPetEffect").textContent = format(new Decimal(5).pow(game.dragonPets ** 0.5), 2)
  }
}

//Hypergod stuff is here because I don't want to make another script file only for this
function defeatHypergod() {
	if (game.gold.gte(hypergodDefeatCosts[game.hypergodsDefeated])) {
		game.hypergodsDefeated++
		if (game.hypergodsDefeated == 12) {
			document.getElementById("hypergodImage").style.display = "none"
			document.getElementById("hypergodName").style.display = "none"
			document.getElementById("hypergodText").innerHTML = "&#8202;&#8202;再没有超神可供击败了！"
			document.getElementById("hypergodButton").style.display = "none"
			document.getElementById("bigFinishButton").style.display = "block"
		}
		else {
			document.getElementById("hypergodImage").src = "img/hypergod" + (game.hypergodsDefeated+1) + ".png"
			document.getElementById("hypergodName").innerHTML = hypergodNames[game.hypergodsDefeated]
			document.getElementById("hypergodText").innerHTML = hypergodText[game.hypergodsDefeated]
			document.getElementById("hypergodDefeatCost").textContent = format(hypergodDefeatCosts[game.hypergodsDefeated])
		}
	}
}