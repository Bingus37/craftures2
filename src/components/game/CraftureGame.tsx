import { useGameState } from "@/hooks/useGameState";
import { useInventory } from "@/hooks/useInventory";
import { StarterSelection } from "./StarterSelection";
import { MainMenu } from "./MainMenu";
import { EncounterScreen } from "./EncounterScreen";
import { CollectionScreen } from "./CollectionScreen";
import { CareScreen } from "./CareScreen";
import { BattleScreen } from "./BattleScreen";
import { InventoryScreen } from "./InventoryScreen";
import { EncyclopediaScreen } from "./EncyclopediaScreen";
import { StageRoadScreen, Stage } from "./StageRoadScreen";
import { ShopScreen } from "./ShopScreen";
import { BiomeMapScreen } from "./BiomeMapScreen";
import { ArenaScreen, ArenaTrainer } from "./ArenaScreen";
import { CatchScreen } from "./CatchScreen";
import { DailyChallengeScreen, DailyChallenge } from "./DailyChallengeScreen";
import { BreedingPenScreen } from "./BreedingPenScreen";
import { BiomeNode, EncounterZone } from "@/data/biomes";
import { useState } from "react";
import { getItem } from "@/types/inventory";

export function CraftureGame() {
  const {
    currentScreen,
    setCurrentScreen,
    ownedCraftures,
    selectedCraftureId,
    setSelectedCraftureId,
    completedStages,
    completedBiomeNodes,
    discoveredSpecies,
    hasStarterPicked,
    isLoaded,
    addCrafture,
    discoverSpecies,
    completeStage,
    completeBiomeNode,
    feedCrafture,
    drainHunger,
    petCrafture,
    playCrafture,
    gainExperience,
    evolveCrafture,
    checkCanEvolve,
    healCrafture,
    updateCraftureHp,
    resetGame,
    unlockAllSpecies,
  } = useGameState();

  const {
    inventory,
    coins,
    isLoaded: inventoryLoaded,
    addItem,
    removeItem,
    addCoins,
    buyItem,
    getBallsInInventory,
    resetInventory,
  } = useInventory();

  const [battleData, setBattleData] = useState<{
    wildSpeciesId: string;
    wildLevel: number;
    stageId?: number;
    biomeNodeId?: string;
    stageRewards?: { coins: number; xp: number };
    isSearchEncounter?: boolean; // For catch mechanics after search battles
    dailyChallengeId?: string; // For daily challenge tracking
  } | null>(null);

  const [showCatchScreen, setShowCatchScreen] = useState<{
    wildSpeciesId: string;
    wildLevel: number;
  } | null>(null);

  const [completedDailyChallenges, setCompletedDailyChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('craftures-daily-challenges');
    if (saved) {
      const { date, completed } = JSON.parse(saved);
      // Reset if it's a new day
      const today = new Date().toDateString();
      if (date === today) {
        return completed;
      }
    }
    return [];
  });

  // Show loading while checking localStorage
  if (!isLoaded || !inventoryLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your Craftures...</p>
        </div>
      </div>
    );
  }

  // If no starter picked, show starter selection
  if (!hasStarterPicked) {
    return (
      <StarterSelection
        onSelect={(speciesId) => {
          addCrafture(speciesId);
          setCurrentScreen("menu");
        }}
      />
    );
  }

  // Handle using an item on a crafture
  const handleUseItem = (itemId: string, craftureId: string) => {
    const item = getItem(itemId);
    const crafture = ownedCraftures.find((c) => c.id === craftureId);
    if (!item || !crafture) return;

    // Check if we have the item
    if (!removeItem(itemId, 1)) return;

    if (item.type === "potion") {
      // Food items restore hunger, HP potions restore HP
      if (itemId === "berrySnack" || itemId === "gourmetMeal") {
        feedCrafture(craftureId, item.healAmount || 30);
      } else {
        const newHp = Math.min(crafture.maxHp, crafture.hp + (item.healAmount || 20));
        updateCraftureHp(craftureId, newHp);
      }
    } else if (item.type === "revive") {
      if (crafture.hp === 0) {
        const healPercent = item.healAmount || 0.5;
        const newHp = Math.floor(crafture.maxHp * healPercent);
        updateCraftureHp(craftureId, newHp);
      }
    }
  };

  // Handle battle
  if (currentScreen === "battle" && battleData) {
    const selectedCrafture =
      ownedCraftures.find((c) => c.id === selectedCraftureId && c.hp > 0) ||
      ownedCraftures.find((c) => c.hp > 0) ||
      ownedCraftures[0];

    if (!selectedCrafture) {
      setCurrentScreen("menu");
      return null;
    }

    // Check if any crafture is alive
    const hasAliveCrafture = ownedCraftures.some((c) => c.hp > 0);
    if (!hasAliveCrafture) {
      setBattleData(null);
      setCurrentScreen("menu");
      return null;
    }

    return (
      <BattleScreen
        playerCrafture={selectedCrafture}
        wildSpeciesId={battleData.wildSpeciesId}
        wildLevel={battleData.wildLevel}
        allOwnedCraftures={ownedCraftures}
        onCraftureSwitch={(newId) => setSelectedCraftureId(newId)}
        inventory={inventory}
        onUseItem={handleUseItem}
        onEnd={(won, expGained, hungerLost) => {
          if (selectedCrafture) {
            // Drain hunger after battle
            drainHunger(selectedCrafture.id, hungerLost);

            if (won) {
              // Give full XP to every crafture
              ownedCraftures.forEach((c) => {
                gainExperience(c.id, expGained);
              });

              // Handle stage completion
              if (battleData.stageId && battleData.stageRewards) {
                completeStage(battleData.stageId);
                addCoins(battleData.stageRewards.coins);
              } else if (battleData.biomeNodeId && battleData.stageRewards) {
                // Handle biome node completion
                completeBiomeNode(battleData.biomeNodeId);
                addCoins(battleData.stageRewards.coins);
              } else if (battleData.dailyChallengeId && battleData.stageRewards) {
                // Handle daily challenge completion
                const newCompleted = [...completedDailyChallenges, battleData.dailyChallengeId];
                setCompletedDailyChallenges(newCompleted);
                localStorage.setItem('craftures-daily-challenges', JSON.stringify({
                  date: new Date().toDateString(),
                  completed: newCompleted,
                }));
                addCoins(battleData.stageRewards.coins);
              } else {
                // Regular battle coins
                addCoins(Math.floor(battleData.wildLevel * 15));
              }

              // Discover the species we fought
              discoverSpecies(battleData.wildSpeciesId);

              // If it's a search encounter, show catch screen
              if (battleData.isSearchEncounter) {
                setShowCatchScreen({ wildSpeciesId: battleData.wildSpeciesId, wildLevel: battleData.wildLevel });
                setBattleData(null);
                return; // Don't go back to menu yet
              }
            }
          }
          setBattleData(null);
          setCurrentScreen("menu");
        }}
        onBack={() => {
          setBattleData(null);
          setCurrentScreen("menu");
        }}
      />
    );
  }

  // Handle catch screen after winning search encounter
  if (showCatchScreen) {
    return (
      <CatchScreen
        wildSpeciesId={showCatchScreen.wildSpeciesId}
        wildLevel={showCatchScreen.wildLevel}
        inventory={inventory}
        onUseBall={(itemId) => removeItem(itemId, 1)}
        onCatch={(speciesId) => {
          addCrafture(speciesId, undefined, showCatchScreen.wildLevel);
          setShowCatchScreen(null);
          setCurrentScreen("menu");
        }}
        onSkip={() => {
          setShowCatchScreen(null);
          setCurrentScreen("menu");
        }}
      />
    );
  }

  // Handle inventory screen
  if (currentScreen === "inventory") {
    return (
      <InventoryScreen
        inventory={inventory}
        coins={coins}
        ownedCraftures={ownedCraftures}
        onBack={() => setCurrentScreen("menu")}
        onUseItem={handleUseItem}
        onBuyItem={buyItem}
      />
    );
  }

  // Handle encyclopedia screen
  if (currentScreen === "encyclopedia") {
    return <EncyclopediaScreen onBack={() => setCurrentScreen("menu")} discoveredSpeciesIds={discoveredSpecies} />;
  }

  // Handle stage road screen
  if (currentScreen === "stageroad") {
    return (
      <StageRoadScreen
        onBack={() => setCurrentScreen("menu")}
        onStartBattle={(stage: Stage) => {
          setBattleData({
            wildSpeciesId: stage.enemySpeciesId,
            wildLevel: stage.enemyLevel,
            stageId: stage.id,
            stageRewards: stage.rewards,
          });
          setCurrentScreen("battle");
        }}
        completedStages={completedStages}
        ownedCraftures={ownedCraftures}
      />
    );
  }

  // Handle shop screen
  if (currentScreen === "shop") {
    return <ShopScreen coins={coins} onBack={() => setCurrentScreen("menu")} onBuyItem={buyItem} />;
  }

  // Handle biome map screen
  if (currentScreen === "biomemap") {
    return (
      <BiomeMapScreen
        onBack={() => setCurrentScreen("menu")}
        onStartBattle={(node: BiomeNode) => {
          setBattleData({
            wildSpeciesId: node.enemySpeciesId,
            wildLevel: node.enemyLevel,
            biomeNodeId: node.id,
            stageRewards: node.rewards,
            isSearchEncounter: true, // Enable catching after biome battles
          });
          setCurrentScreen("battle");
        }}
        onStartEncounter={(zone) => {
          // Pick a random species from the zone - 10% chance for rathalos if in list
          let selectedSpecies = zone.possibleSpecies[Math.floor(Math.random() * zone.possibleSpecies.length)];
          if (zone.possibleSpecies.includes("rathalos") && Math.random() < 0.1) {
            selectedSpecies = "rathalos";
          }
          const randomLevel = Math.floor(Math.random() * (zone.maxLevel - zone.minLevel + 1)) + zone.minLevel;
          discoverSpecies(selectedSpecies);
          setBattleData({ wildSpeciesId: selectedSpecies, wildLevel: randomLevel, isSearchEncounter: true });
          setCurrentScreen("battle");
        }}
        completedNodes={completedBiomeNodes}
        ownedCraftures={ownedCraftures}
      />
    );
  }

  // Handle arena screen
  if (currentScreen === "arena") {
    return (
      <ArenaScreen
        onBack={() => setCurrentScreen("menu")}
        onStartBattle={(trainer: ArenaTrainer) => {
          setBattleData({
            wildSpeciesId: trainer.team[0].speciesId,
            wildLevel: trainer.team[0].level,
            stageRewards: trainer.rewards,
          });
          setCurrentScreen("battle");
        }}
        ownedCraftures={ownedCraftures}
        defeatedTrainers={[]}
      />
    );
  }

  // Handle daily challenge screen
  if (currentScreen === "dailychallenge") {
    return (
      <DailyChallengeScreen
        onBack={() => setCurrentScreen("menu")}
        onStartBattle={(challenge: DailyChallenge) => {
          setBattleData({
            wildSpeciesId: challenge.enemySpeciesId,
            wildLevel: challenge.enemyLevel,
            stageRewards: challenge.rewards,
            dailyChallengeId: challenge.id,
          });
          setCurrentScreen("battle");
        }}
        ownedCraftures={ownedCraftures}
        completedChallenges={completedDailyChallenges}
      />
    );
  }

  // Handle breeding pen screen
  if (currentScreen === "breedingpen") {
    return (
      <BreedingPenScreen
        onBack={() => setCurrentScreen("menu")}
        ownedCraftures={ownedCraftures}
        coins={coins}
        onAddCoins={addCoins}
        onAddCrafture={addCrafture}
      />
    );
  }

  switch (currentScreen) {
    case "menu":
      return (
        <MainMenu
          ownedCraftures={ownedCraftures}
          coins={coins}
          onNavigate={setCurrentScreen}
          onResetGame={() => {
            resetGame();
            resetInventory();
          }}
          onUnlockAllSpecies={unlockAllSpecies}
        />
      );

    case "encounter":
      return (
        <EncounterScreen
          onBack={() => setCurrentScreen("menu")}
          onCatch={(speciesId) => {
            addCrafture(speciesId);
          }}
          onBattle={(wildSpeciesId, wildLevel) => {
            discoverSpecies(wildSpeciesId);
            setBattleData({ wildSpeciesId, wildLevel, isSearchEncounter: true });
            setCurrentScreen("battle");
          }}
          ownedSpeciesIds={ownedCraftures.map((c) => c.speciesId)}
          inventory={inventory}
          onUseBall={(itemId) => removeItem(itemId, 1)}
        />
      );

    case "collection":
      return (
        <CollectionScreen
          ownedCraftures={ownedCraftures}
          onBack={() => setCurrentScreen("menu")}
          onSelectCrafture={(id) => {
            setSelectedCraftureId(id);
            setCurrentScreen("care");
          }}
        />
      );

    case "care":
      return (
        <CareScreen
          ownedCraftures={ownedCraftures}
          selectedCraftureId={selectedCraftureId || ownedCraftures[0]?.id || null}
          onBack={() => setCurrentScreen("menu")}
          onFeed={feedCrafture}
          onPet={petCrafture}
          onPlay={playCrafture}
          onSelectCrafture={setSelectedCraftureId}
          onEvolve={evolveCrafture}
          checkCanEvolve={checkCanEvolve}
          onHeal={healCrafture}
        />
      );

    default:
      return (
        <MainMenu
          ownedCraftures={ownedCraftures}
          coins={coins}
          onNavigate={setCurrentScreen}
          onResetGame={() => {
            resetGame();
            resetInventory();
          }}
          onUnlockAllSpecies={unlockAllSpecies}
        />
      );
  }
}
