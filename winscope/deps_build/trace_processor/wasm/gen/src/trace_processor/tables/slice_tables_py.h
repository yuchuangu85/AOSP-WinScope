#ifndef SRC_TRACE_PROCESSOR_TABLES_SLICE_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_SLICE_TABLES_PY_H_

#include <array>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <optional>
#include <type_traits>
#include <utility>
#include <vector>

#include "perfetto/base/logging.h"
#include "perfetto/trace_processor/basic_types.h"
#include "perfetto/trace_processor/ref_counted.h"
#include "src/trace_processor/containers/bit_vector.h"
#include "src/trace_processor/containers/row_map.h"
#include "src/trace_processor/containers/string_pool.h"
#include "src/trace_processor/db/column/arrangement_overlay.h"
#include "src/trace_processor/db/column/data_layer.h"
#include "src/trace_processor/db/column/dense_null_overlay.h"
#include "src/trace_processor/db/column/numeric_storage.h"
#include "src/trace_processor/db/column/id_storage.h"
#include "src/trace_processor/db/column/null_overlay.h"
#include "src/trace_processor/db/column/range_overlay.h"
#include "src/trace_processor/db/column/selector_overlay.h"
#include "src/trace_processor/db/column/set_id_storage.h"
#include "src/trace_processor/db/column/string_storage.h"
#include "src/trace_processor/db/column/types.h"
#include "src/trace_processor/db/column_storage.h"
#include "src/trace_processor/db/column.h"
#include "src/trace_processor/db/table.h"
#include "src/trace_processor/db/typed_column.h"
#include "src/trace_processor/db/typed_column_internal.h"
#include "src/trace_processor/tables/macros_internal.h"

#include "src/trace_processor/tables/track_tables_py.h"

namespace perfetto::trace_processor::tables {

class SliceTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 15;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
  };
  struct ColumnType {
    using id = IdColumn<SliceTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<SliceTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<SliceTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          dur(in_dur),
          track_id(in_track_id),
          category(in_category),
          name(in_name),
          depth(in_depth),
          stack_id(in_stack_id),
          parent_stack_id(in_parent_stack_id),
          parent_id(in_parent_id),
          arg_set_id(in_arg_set_id),
          thread_ts(in_thread_ts),
          thread_dur(in_thread_dur),
          thread_instruction_count(in_thread_instruction_count),
          thread_instruction_delta(in_thread_instruction_delta) {}
    int64_t ts;
    int64_t dur;
    TrackTable::Id track_id;
    std::optional<StringPool::Id> category;
    std::optional<StringPool::Id> name;
    uint32_t depth;
    int64_t stack_id;
    int64_t parent_stack_id;
    std::optional<SliceTable::Id> parent_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<int64_t> thread_ts;
    std::optional<int64_t> thread_dur;
    std::optional<int64_t> thread_instruction_count;
    std::optional<int64_t> thread_instruction_delta;

    bool operator==(const SliceTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t dur = ColumnType::dur::default_flags();
    static constexpr uint32_t track_id = ColumnType::track_id::default_flags();
    static constexpr uint32_t category = ColumnType::category::default_flags();
    static constexpr uint32_t name = ColumnType::name::default_flags();
    static constexpr uint32_t depth = ColumnType::depth::default_flags();
    static constexpr uint32_t stack_id = ColumnType::stack_id::default_flags();
    static constexpr uint32_t parent_stack_id = ColumnType::parent_stack_id::default_flags();
    static constexpr uint32_t parent_id = ColumnType::parent_id::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t thread_ts = ColumnType::thread_ts::default_flags();
    static constexpr uint32_t thread_dur = ColumnType::thread_dur::default_flags();
    static constexpr uint32_t thread_instruction_count = ColumnType::thread_instruction_count::default_flags();
    static constexpr uint32_t thread_instruction_delta = ColumnType::thread_instruction_delta::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      SliceTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    SliceTable, RowNumber> {
   public:
    ConstRowReference(const SliceTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const SliceTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }

   private:
    SliceTable* mutable_table() const {
      return const_cast<SliceTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, SliceTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const SliceTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class SliceTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, SliceTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<SliceTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class SliceTable;

     explicit Iterator(SliceTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      SliceTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "dur", &self->dur_, ColumnFlag::dur,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "track_id", &self->track_id_, ColumnFlag::track_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "category", &self->category_, ColumnFlag::category,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "name", &self->name_, ColumnFlag::name,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "depth", &self->depth_, ColumnFlag::depth,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "stack_id", &self->stack_id_, ColumnFlag::stack_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "parent_stack_id", &self->parent_stack_id_, ColumnFlag::parent_stack_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "parent_id", &self->parent_id_, ColumnFlag::parent_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "thread_ts", &self->thread_ts_, ColumnFlag::thread_ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "thread_dur", &self->thread_dur_, ColumnFlag::thread_dur,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "thread_instruction_count", &self->thread_instruction_count_, ColumnFlag::thread_instruction_count,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "thread_instruction_delta", &self->thread_instruction_delta_, ColumnFlag::thread_instruction_delta,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit SliceTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        dur_(ColumnStorage<ColumnType::dur::stored_type>::Create<false>()),
        track_id_(ColumnStorage<ColumnType::track_id::stored_type>::Create<false>()),
        category_(ColumnStorage<ColumnType::category::stored_type>::Create<false>()),
        name_(ColumnStorage<ColumnType::name::stored_type>::Create<false>()),
        depth_(ColumnStorage<ColumnType::depth::stored_type>::Create<false>()),
        stack_id_(ColumnStorage<ColumnType::stack_id::stored_type>::Create<false>()),
        parent_stack_id_(ColumnStorage<ColumnType::parent_stack_id::stored_type>::Create<false>()),
        parent_id_(ColumnStorage<ColumnType::parent_id::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        thread_ts_(ColumnStorage<ColumnType::thread_ts::stored_type>::Create<false>()),
        thread_dur_(ColumnStorage<ColumnType::thread_dur::stored_type>::Create<false>()),
        thread_instruction_count_(ColumnStorage<ColumnType::thread_instruction_count::stored_type>::Create<false>()),
        thread_instruction_delta_(ColumnStorage<ColumnType::thread_instruction_delta::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        dur_storage_layer_(
        new column::NumericStorage<ColumnType::dur::non_optional_stored_type>(
          &dur_.vector(),
          ColumnTypeHelper<ColumnType::dur::stored_type>::ToColumnType(),
          false)),
        track_id_storage_layer_(
        new column::NumericStorage<ColumnType::track_id::non_optional_stored_type>(
          &track_id_.vector(),
          ColumnTypeHelper<ColumnType::track_id::stored_type>::ToColumnType(),
          false)),
        category_storage_layer_(
          new column::StringStorage(string_pool(), &category_.vector())),
        name_storage_layer_(
          new column::StringStorage(string_pool(), &name_.vector())),
        depth_storage_layer_(
        new column::NumericStorage<ColumnType::depth::non_optional_stored_type>(
          &depth_.vector(),
          ColumnTypeHelper<ColumnType::depth::stored_type>::ToColumnType(),
          false)),
        stack_id_storage_layer_(
        new column::NumericStorage<ColumnType::stack_id::non_optional_stored_type>(
          &stack_id_.vector(),
          ColumnTypeHelper<ColumnType::stack_id::stored_type>::ToColumnType(),
          false)),
        parent_stack_id_storage_layer_(
        new column::NumericStorage<ColumnType::parent_stack_id::non_optional_stored_type>(
          &parent_stack_id_.vector(),
          ColumnTypeHelper<ColumnType::parent_stack_id::stored_type>::ToColumnType(),
          false)),
        parent_id_storage_layer_(
          new column::NumericStorage<ColumnType::parent_id::non_optional_stored_type>(
            &parent_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::parent_id::stored_type>::ToColumnType(),
            false)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        thread_ts_storage_layer_(
          new column::NumericStorage<ColumnType::thread_ts::non_optional_stored_type>(
            &thread_ts_.non_null_vector(),
            ColumnTypeHelper<ColumnType::thread_ts::stored_type>::ToColumnType(),
            false)),
        thread_dur_storage_layer_(
          new column::NumericStorage<ColumnType::thread_dur::non_optional_stored_type>(
            &thread_dur_.non_null_vector(),
            ColumnTypeHelper<ColumnType::thread_dur::stored_type>::ToColumnType(),
            false)),
        thread_instruction_count_storage_layer_(
          new column::NumericStorage<ColumnType::thread_instruction_count::non_optional_stored_type>(
            &thread_instruction_count_.non_null_vector(),
            ColumnTypeHelper<ColumnType::thread_instruction_count::stored_type>::ToColumnType(),
            false)),
        thread_instruction_delta_storage_layer_(
          new column::NumericStorage<ColumnType::thread_instruction_delta::non_optional_stored_type>(
            &thread_instruction_delta_.non_null_vector(),
            ColumnTypeHelper<ColumnType::thread_instruction_delta::stored_type>::ToColumnType(),
            false))
,
        parent_id_null_layer_(new column::NullOverlay(parent_id_.bv())),
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        thread_ts_null_layer_(new column::NullOverlay(thread_ts_.bv())),
        thread_dur_null_layer_(new column::NullOverlay(thread_dur_.bv())),
        thread_instruction_count_null_layer_(new column::NullOverlay(thread_instruction_count_.bv())),
        thread_instruction_delta_null_layer_(new column::NullOverlay(thread_instruction_delta_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::dur::stored_type>(
          ColumnFlag::dur),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::track_id::stored_type>(
          ColumnFlag::track_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::category::stored_type>(
          ColumnFlag::category),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::name::stored_type>(
          ColumnFlag::name),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::depth::stored_type>(
          ColumnFlag::depth),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::stack_id::stored_type>(
          ColumnFlag::stack_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::parent_stack_id::stored_type>(
          ColumnFlag::parent_stack_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::parent_id::stored_type>(
          ColumnFlag::parent_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::thread_ts::stored_type>(
          ColumnFlag::thread_ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::thread_dur::stored_type>(
          ColumnFlag::thread_dur),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::thread_instruction_count::stored_type>(
          ColumnFlag::thread_instruction_count),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::thread_instruction_delta::stored_type>(
          ColumnFlag::thread_instruction_delta),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,dur_storage_layer_,track_id_storage_layer_,category_storage_layer_,name_storage_layer_,depth_storage_layer_,stack_id_storage_layer_,parent_stack_id_storage_layer_,parent_id_storage_layer_,arg_set_id_storage_layer_,thread_ts_storage_layer_,thread_dur_storage_layer_,thread_instruction_count_storage_layer_,thread_instruction_delta_storage_layer_},
      {{},{},{},{},{},{},{},{},{},parent_id_null_layer_,arg_set_id_null_layer_,thread_ts_null_layer_,thread_dur_null_layer_,thread_instruction_count_null_layer_,thread_instruction_delta_null_layer_});
  }
  ~SliceTable() override;

  static const char* Name() { return "__intrinsic_slice"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    ts_.ShrinkToFit();
    dur_.ShrinkToFit();
    track_id_.ShrinkToFit();
    category_.ShrinkToFit();
    name_.ShrinkToFit();
    depth_.ShrinkToFit();
    stack_id_.ShrinkToFit();
    parent_stack_id_.ShrinkToFit();
    parent_id_.ShrinkToFit();
    arg_set_id_.ShrinkToFit();
    thread_ts_.ShrinkToFit();
    thread_dur_.ShrinkToFit();
    thread_instruction_count_.ShrinkToFit();
    thread_instruction_delta_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{row_number};
    mutable_ts()->Append(row.ts);
    mutable_dur()->Append(row.dur);
    mutable_track_id()->Append(row.track_id);
    mutable_category()->Append(row.category);
    mutable_name()->Append(row.name);
    mutable_depth()->Append(row.depth);
    mutable_stack_id()->Append(row.stack_id);
    mutable_parent_stack_id()->Append(row.parent_stack_id);
    mutable_parent_id()->Append(row.parent_id);
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_thread_ts()->Append(row.thread_ts);
    mutable_thread_dur()->Append(row.thread_dur);
    mutable_thread_instruction_count()->Append(row.thread_instruction_count);
    mutable_thread_instruction_delta()->Append(row.thread_instruction_delta);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<SliceTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<SliceTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<SliceTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::dur::stored_type> dur_;
  ColumnStorage<ColumnType::track_id::stored_type> track_id_;
  ColumnStorage<ColumnType::category::stored_type> category_;
  ColumnStorage<ColumnType::name::stored_type> name_;
  ColumnStorage<ColumnType::depth::stored_type> depth_;
  ColumnStorage<ColumnType::stack_id::stored_type> stack_id_;
  ColumnStorage<ColumnType::parent_stack_id::stored_type> parent_stack_id_;
  ColumnStorage<ColumnType::parent_id::stored_type> parent_id_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::thread_ts::stored_type> thread_ts_;
  ColumnStorage<ColumnType::thread_dur::stored_type> thread_dur_;
  ColumnStorage<ColumnType::thread_instruction_count::stored_type> thread_instruction_count_;
  ColumnStorage<ColumnType::thread_instruction_delta::stored_type> thread_instruction_delta_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> dur_storage_layer_;
  RefPtr<column::StorageLayer> track_id_storage_layer_;
  RefPtr<column::StorageLayer> category_storage_layer_;
  RefPtr<column::StorageLayer> name_storage_layer_;
  RefPtr<column::StorageLayer> depth_storage_layer_;
  RefPtr<column::StorageLayer> stack_id_storage_layer_;
  RefPtr<column::StorageLayer> parent_stack_id_storage_layer_;
  RefPtr<column::StorageLayer> parent_id_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> thread_ts_storage_layer_;
  RefPtr<column::StorageLayer> thread_dur_storage_layer_;
  RefPtr<column::StorageLayer> thread_instruction_count_storage_layer_;
  RefPtr<column::StorageLayer> thread_instruction_delta_storage_layer_;

  RefPtr<column::OverlayLayer> parent_id_null_layer_;
  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> thread_ts_null_layer_;
  RefPtr<column::OverlayLayer> thread_dur_null_layer_;
  RefPtr<column::OverlayLayer> thread_instruction_count_null_layer_;
  RefPtr<column::OverlayLayer> thread_instruction_delta_null_layer_;
};
  

class AndroidNetworkPacketsTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 29;

  using Id = SliceTable::Id;
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t depth = 6;
    static constexpr uint32_t stack_id = 7;
    static constexpr uint32_t parent_stack_id = 8;
    static constexpr uint32_t parent_id = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t thread_ts = 11;
    static constexpr uint32_t thread_dur = 12;
    static constexpr uint32_t thread_instruction_count = 13;
    static constexpr uint32_t thread_instruction_delta = 14;
    static constexpr uint32_t iface = 15;
    static constexpr uint32_t direction = 16;
    static constexpr uint32_t packet_transport = 17;
    static constexpr uint32_t packet_length = 18;
    static constexpr uint32_t packet_count = 19;
    static constexpr uint32_t socket_tag = 20;
    static constexpr uint32_t socket_tag_str = 21;
    static constexpr uint32_t socket_uid = 22;
    static constexpr uint32_t local_port = 23;
    static constexpr uint32_t remote_port = 24;
    static constexpr uint32_t packet_icmp_type = 25;
    static constexpr uint32_t packet_icmp_code = 26;
    static constexpr uint32_t packet_tcp_flags = 27;
    static constexpr uint32_t packet_tcp_flags_str = 28;
  };
  struct ColumnType {
    using id = IdColumn<AndroidNetworkPacketsTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using depth = TypedColumn<uint32_t>;
    using stack_id = TypedColumn<int64_t>;
    using parent_stack_id = TypedColumn<int64_t>;
    using parent_id = TypedColumn<std::optional<AndroidNetworkPacketsTable::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using thread_ts = TypedColumn<std::optional<int64_t>>;
    using thread_dur = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_count = TypedColumn<std::optional<int64_t>>;
    using thread_instruction_delta = TypedColumn<std::optional<int64_t>>;
    using iface = TypedColumn<StringPool::Id>;
    using direction = TypedColumn<StringPool::Id>;
    using packet_transport = TypedColumn<StringPool::Id>;
    using packet_length = TypedColumn<int64_t>;
    using packet_count = TypedColumn<int64_t>;
    using socket_tag = TypedColumn<uint32_t>;
    using socket_tag_str = TypedColumn<StringPool::Id>;
    using socket_uid = TypedColumn<uint32_t>;
    using local_port = TypedColumn<std::optional<uint32_t>>;
    using remote_port = TypedColumn<std::optional<uint32_t>>;
    using packet_icmp_type = TypedColumn<std::optional<uint32_t>>;
    using packet_icmp_code = TypedColumn<std::optional<uint32_t>>;
    using packet_tcp_flags = TypedColumn<std::optional<uint32_t>>;
    using packet_tcp_flags_str = TypedColumn<std::optional<StringPool::Id>>;
  };
  struct Row : public SliceTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        uint32_t in_depth = {},
        int64_t in_stack_id = {},
        int64_t in_parent_stack_id = {},
        std::optional<AndroidNetworkPacketsTable::Id> in_parent_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<int64_t> in_thread_ts = {},
        std::optional<int64_t> in_thread_dur = {},
        std::optional<int64_t> in_thread_instruction_count = {},
        std::optional<int64_t> in_thread_instruction_delta = {},
        StringPool::Id in_iface = {},
        StringPool::Id in_direction = {},
        StringPool::Id in_packet_transport = {},
        int64_t in_packet_length = {},
        int64_t in_packet_count = {},
        uint32_t in_socket_tag = {},
        StringPool::Id in_socket_tag_str = {},
        uint32_t in_socket_uid = {},
        std::optional<uint32_t> in_local_port = {},
        std::optional<uint32_t> in_remote_port = {},
        std::optional<uint32_t> in_packet_icmp_type = {},
        std::optional<uint32_t> in_packet_icmp_code = {},
        std::optional<uint32_t> in_packet_tcp_flags = {},
        std::optional<StringPool::Id> in_packet_tcp_flags_str = {},
        std::nullptr_t = nullptr)
        : SliceTable::Row(in_ts, in_dur, in_track_id, in_category, in_name, in_depth, in_stack_id, in_parent_stack_id, in_parent_id, in_arg_set_id, in_thread_ts, in_thread_dur, in_thread_instruction_count, in_thread_instruction_delta),
          iface(in_iface),
          direction(in_direction),
          packet_transport(in_packet_transport),
          packet_length(in_packet_length),
          packet_count(in_packet_count),
          socket_tag(in_socket_tag),
          socket_tag_str(in_socket_tag_str),
          socket_uid(in_socket_uid),
          local_port(in_local_port),
          remote_port(in_remote_port),
          packet_icmp_type(in_packet_icmp_type),
          packet_icmp_code(in_packet_icmp_code),
          packet_tcp_flags(in_packet_tcp_flags),
          packet_tcp_flags_str(in_packet_tcp_flags_str) {}
    StringPool::Id iface;
    StringPool::Id direction;
    StringPool::Id packet_transport;
    int64_t packet_length;
    int64_t packet_count;
    uint32_t socket_tag;
    StringPool::Id socket_tag_str;
    uint32_t socket_uid;
    std::optional<uint32_t> local_port;
    std::optional<uint32_t> remote_port;
    std::optional<uint32_t> packet_icmp_type;
    std::optional<uint32_t> packet_icmp_code;
    std::optional<uint32_t> packet_tcp_flags;
    std::optional<StringPool::Id> packet_tcp_flags_str;

    bool operator==(const AndroidNetworkPacketsTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::depth::Equals(depth, other.depth) &&
       ColumnType::stack_id::Equals(stack_id, other.stack_id) &&
       ColumnType::parent_stack_id::Equals(parent_stack_id, other.parent_stack_id) &&
       ColumnType::parent_id::Equals(parent_id, other.parent_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::thread_ts::Equals(thread_ts, other.thread_ts) &&
       ColumnType::thread_dur::Equals(thread_dur, other.thread_dur) &&
       ColumnType::thread_instruction_count::Equals(thread_instruction_count, other.thread_instruction_count) &&
       ColumnType::thread_instruction_delta::Equals(thread_instruction_delta, other.thread_instruction_delta) &&
       ColumnType::iface::Equals(iface, other.iface) &&
       ColumnType::direction::Equals(direction, other.direction) &&
       ColumnType::packet_transport::Equals(packet_transport, other.packet_transport) &&
       ColumnType::packet_length::Equals(packet_length, other.packet_length) &&
       ColumnType::packet_count::Equals(packet_count, other.packet_count) &&
       ColumnType::socket_tag::Equals(socket_tag, other.socket_tag) &&
       ColumnType::socket_tag_str::Equals(socket_tag_str, other.socket_tag_str) &&
       ColumnType::socket_uid::Equals(socket_uid, other.socket_uid) &&
       ColumnType::local_port::Equals(local_port, other.local_port) &&
       ColumnType::remote_port::Equals(remote_port, other.remote_port) &&
       ColumnType::packet_icmp_type::Equals(packet_icmp_type, other.packet_icmp_type) &&
       ColumnType::packet_icmp_code::Equals(packet_icmp_code, other.packet_icmp_code) &&
       ColumnType::packet_tcp_flags::Equals(packet_tcp_flags, other.packet_tcp_flags) &&
       ColumnType::packet_tcp_flags_str::Equals(packet_tcp_flags_str, other.packet_tcp_flags_str);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t iface = ColumnType::iface::default_flags();
    static constexpr uint32_t direction = ColumnType::direction::default_flags();
    static constexpr uint32_t packet_transport = ColumnType::packet_transport::default_flags();
    static constexpr uint32_t packet_length = ColumnType::packet_length::default_flags();
    static constexpr uint32_t packet_count = ColumnType::packet_count::default_flags();
    static constexpr uint32_t socket_tag = ColumnType::socket_tag::default_flags();
    static constexpr uint32_t socket_tag_str = ColumnType::socket_tag_str::default_flags();
    static constexpr uint32_t socket_uid = ColumnType::socket_uid::default_flags();
    static constexpr uint32_t local_port = ColumnType::local_port::default_flags();
    static constexpr uint32_t remote_port = ColumnType::remote_port::default_flags();
    static constexpr uint32_t packet_icmp_type = ColumnType::packet_icmp_type::default_flags();
    static constexpr uint32_t packet_icmp_code = ColumnType::packet_icmp_code::default_flags();
    static constexpr uint32_t packet_tcp_flags = ColumnType::packet_tcp_flags::default_flags();
    static constexpr uint32_t packet_tcp_flags_str = ColumnType::packet_tcp_flags_str::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      AndroidNetworkPacketsTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    AndroidNetworkPacketsTable, RowNumber> {
   public:
    ConstRowReference(const AndroidNetworkPacketsTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::depth::type depth() const {
      return table()->depth()[row_number_];
    }
    ColumnType::stack_id::type stack_id() const {
      return table()->stack_id()[row_number_];
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      return table()->parent_stack_id()[row_number_];
    }
    ColumnType::parent_id::type parent_id() const {
      return table()->parent_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::thread_ts::type thread_ts() const {
      return table()->thread_ts()[row_number_];
    }
    ColumnType::thread_dur::type thread_dur() const {
      return table()->thread_dur()[row_number_];
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      return table()->thread_instruction_count()[row_number_];
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      return table()->thread_instruction_delta()[row_number_];
    }
    ColumnType::iface::type iface() const {
      return table()->iface()[row_number_];
    }
    ColumnType::direction::type direction() const {
      return table()->direction()[row_number_];
    }
    ColumnType::packet_transport::type packet_transport() const {
      return table()->packet_transport()[row_number_];
    }
    ColumnType::packet_length::type packet_length() const {
      return table()->packet_length()[row_number_];
    }
    ColumnType::packet_count::type packet_count() const {
      return table()->packet_count()[row_number_];
    }
    ColumnType::socket_tag::type socket_tag() const {
      return table()->socket_tag()[row_number_];
    }
    ColumnType::socket_tag_str::type socket_tag_str() const {
      return table()->socket_tag_str()[row_number_];
    }
    ColumnType::socket_uid::type socket_uid() const {
      return table()->socket_uid()[row_number_];
    }
    ColumnType::local_port::type local_port() const {
      return table()->local_port()[row_number_];
    }
    ColumnType::remote_port::type remote_port() const {
      return table()->remote_port()[row_number_];
    }
    ColumnType::packet_icmp_type::type packet_icmp_type() const {
      return table()->packet_icmp_type()[row_number_];
    }
    ColumnType::packet_icmp_code::type packet_icmp_code() const {
      return table()->packet_icmp_code()[row_number_];
    }
    ColumnType::packet_tcp_flags::type packet_tcp_flags() const {
      return table()->packet_tcp_flags()[row_number_];
    }
    ColumnType::packet_tcp_flags_str::type packet_tcp_flags_str() const {
      return table()->packet_tcp_flags_str()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const AndroidNetworkPacketsTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_depth(
        ColumnType::depth::non_optional_type v) {
      return mutable_table()->mutable_depth()->Set(row_number_, v);
    }
    void set_stack_id(
        ColumnType::stack_id::non_optional_type v) {
      return mutable_table()->mutable_stack_id()->Set(row_number_, v);
    }
    void set_parent_stack_id(
        ColumnType::parent_stack_id::non_optional_type v) {
      return mutable_table()->mutable_parent_stack_id()->Set(row_number_, v);
    }
    void set_parent_id(
        ColumnType::parent_id::non_optional_type v) {
      return mutable_table()->mutable_parent_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_thread_ts(
        ColumnType::thread_ts::non_optional_type v) {
      return mutable_table()->mutable_thread_ts()->Set(row_number_, v);
    }
    void set_thread_dur(
        ColumnType::thread_dur::non_optional_type v) {
      return mutable_table()->mutable_thread_dur()->Set(row_number_, v);
    }
    void set_thread_instruction_count(
        ColumnType::thread_instruction_count::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_count()->Set(row_number_, v);
    }
    void set_thread_instruction_delta(
        ColumnType::thread_instruction_delta::non_optional_type v) {
      return mutable_table()->mutable_thread_instruction_delta()->Set(row_number_, v);
    }
    void set_iface(
        ColumnType::iface::non_optional_type v) {
      return mutable_table()->mutable_iface()->Set(row_number_, v);
    }
    void set_direction(
        ColumnType::direction::non_optional_type v) {
      return mutable_table()->mutable_direction()->Set(row_number_, v);
    }
    void set_packet_transport(
        ColumnType::packet_transport::non_optional_type v) {
      return mutable_table()->mutable_packet_transport()->Set(row_number_, v);
    }
    void set_packet_length(
        ColumnType::packet_length::non_optional_type v) {
      return mutable_table()->mutable_packet_length()->Set(row_number_, v);
    }
    void set_packet_count(
        ColumnType::packet_count::non_optional_type v) {
      return mutable_table()->mutable_packet_count()->Set(row_number_, v);
    }
    void set_socket_tag(
        ColumnType::socket_tag::non_optional_type v) {
      return mutable_table()->mutable_socket_tag()->Set(row_number_, v);
    }
    void set_socket_tag_str(
        ColumnType::socket_tag_str::non_optional_type v) {
      return mutable_table()->mutable_socket_tag_str()->Set(row_number_, v);
    }
    void set_socket_uid(
        ColumnType::socket_uid::non_optional_type v) {
      return mutable_table()->mutable_socket_uid()->Set(row_number_, v);
    }
    void set_local_port(
        ColumnType::local_port::non_optional_type v) {
      return mutable_table()->mutable_local_port()->Set(row_number_, v);
    }
    void set_remote_port(
        ColumnType::remote_port::non_optional_type v) {
      return mutable_table()->mutable_remote_port()->Set(row_number_, v);
    }
    void set_packet_icmp_type(
        ColumnType::packet_icmp_type::non_optional_type v) {
      return mutable_table()->mutable_packet_icmp_type()->Set(row_number_, v);
    }
    void set_packet_icmp_code(
        ColumnType::packet_icmp_code::non_optional_type v) {
      return mutable_table()->mutable_packet_icmp_code()->Set(row_number_, v);
    }
    void set_packet_tcp_flags(
        ColumnType::packet_tcp_flags::non_optional_type v) {
      return mutable_table()->mutable_packet_tcp_flags()->Set(row_number_, v);
    }
    void set_packet_tcp_flags_str(
        ColumnType::packet_tcp_flags_str::non_optional_type v) {
      return mutable_table()->mutable_packet_tcp_flags_str()->Set(row_number_, v);
    }

   private:
    AndroidNetworkPacketsTable* mutable_table() const {
      return const_cast<AndroidNetworkPacketsTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, AndroidNetworkPacketsTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::depth::type depth() const {
      const auto& col = table()->depth();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stack_id::type stack_id() const {
      const auto& col = table()->stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_stack_id::type parent_stack_id() const {
      const auto& col = table()->parent_stack_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::parent_id::type parent_id() const {
      const auto& col = table()->parent_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_ts::type thread_ts() const {
      const auto& col = table()->thread_ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_dur::type thread_dur() const {
      const auto& col = table()->thread_dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_count::type thread_instruction_count() const {
      const auto& col = table()->thread_instruction_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::thread_instruction_delta::type thread_instruction_delta() const {
      const auto& col = table()->thread_instruction_delta();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::iface::type iface() const {
      const auto& col = table()->iface();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::direction::type direction() const {
      const auto& col = table()->direction();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_transport::type packet_transport() const {
      const auto& col = table()->packet_transport();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_length::type packet_length() const {
      const auto& col = table()->packet_length();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_count::type packet_count() const {
      const auto& col = table()->packet_count();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::socket_tag::type socket_tag() const {
      const auto& col = table()->socket_tag();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::socket_tag_str::type socket_tag_str() const {
      const auto& col = table()->socket_tag_str();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::socket_uid::type socket_uid() const {
      const auto& col = table()->socket_uid();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::local_port::type local_port() const {
      const auto& col = table()->local_port();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::remote_port::type remote_port() const {
      const auto& col = table()->remote_port();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_icmp_type::type packet_icmp_type() const {
      const auto& col = table()->packet_icmp_type();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_icmp_code::type packet_icmp_code() const {
      const auto& col = table()->packet_icmp_code();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_tcp_flags::type packet_tcp_flags() const {
      const auto& col = table()->packet_tcp_flags();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::packet_tcp_flags_str::type packet_tcp_flags_str() const {
      const auto& col = table()->packet_tcp_flags_str();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const AndroidNetworkPacketsTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class AndroidNetworkPacketsTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, AndroidNetworkPacketsTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<AndroidNetworkPacketsTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class AndroidNetworkPacketsTable;

     explicit Iterator(AndroidNetworkPacketsTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      AndroidNetworkPacketsTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "iface", &self->iface_, ColumnFlag::iface,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "direction", &self->direction_, ColumnFlag::direction,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_transport", &self->packet_transport_, ColumnFlag::packet_transport,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_length", &self->packet_length_, ColumnFlag::packet_length,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_count", &self->packet_count_, ColumnFlag::packet_count,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "socket_tag", &self->socket_tag_, ColumnFlag::socket_tag,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "socket_tag_str", &self->socket_tag_str_, ColumnFlag::socket_tag_str,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "socket_uid", &self->socket_uid_, ColumnFlag::socket_uid,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "local_port", &self->local_port_, ColumnFlag::local_port,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "remote_port", &self->remote_port_, ColumnFlag::remote_port,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_icmp_type", &self->packet_icmp_type_, ColumnFlag::packet_icmp_type,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_icmp_code", &self->packet_icmp_code_, ColumnFlag::packet_icmp_code,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_tcp_flags", &self->packet_tcp_flags_, ColumnFlag::packet_tcp_flags,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "packet_tcp_flags_str", &self->packet_tcp_flags_str_, ColumnFlag::packet_tcp_flags_str,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit AndroidNetworkPacketsTable(StringPool* pool, SliceTable* parent)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, parent),
          parent),
        parent_(parent), const_parent_(parent), iface_(ColumnStorage<ColumnType::iface::stored_type>::Create<false>()),
        direction_(ColumnStorage<ColumnType::direction::stored_type>::Create<false>()),
        packet_transport_(ColumnStorage<ColumnType::packet_transport::stored_type>::Create<false>()),
        packet_length_(ColumnStorage<ColumnType::packet_length::stored_type>::Create<false>()),
        packet_count_(ColumnStorage<ColumnType::packet_count::stored_type>::Create<false>()),
        socket_tag_(ColumnStorage<ColumnType::socket_tag::stored_type>::Create<false>()),
        socket_tag_str_(ColumnStorage<ColumnType::socket_tag_str::stored_type>::Create<false>()),
        socket_uid_(ColumnStorage<ColumnType::socket_uid::stored_type>::Create<false>()),
        local_port_(ColumnStorage<ColumnType::local_port::stored_type>::Create<false>()),
        remote_port_(ColumnStorage<ColumnType::remote_port::stored_type>::Create<false>()),
        packet_icmp_type_(ColumnStorage<ColumnType::packet_icmp_type::stored_type>::Create<false>()),
        packet_icmp_code_(ColumnStorage<ColumnType::packet_icmp_code::stored_type>::Create<false>()),
        packet_tcp_flags_(ColumnStorage<ColumnType::packet_tcp_flags::stored_type>::Create<false>()),
        packet_tcp_flags_str_(ColumnStorage<ColumnType::packet_tcp_flags_str::stored_type>::Create<false>())
,
        iface_storage_layer_(
          new column::StringStorage(string_pool(), &iface_.vector())),
        direction_storage_layer_(
          new column::StringStorage(string_pool(), &direction_.vector())),
        packet_transport_storage_layer_(
          new column::StringStorage(string_pool(), &packet_transport_.vector())),
        packet_length_storage_layer_(
        new column::NumericStorage<ColumnType::packet_length::non_optional_stored_type>(
          &packet_length_.vector(),
          ColumnTypeHelper<ColumnType::packet_length::stored_type>::ToColumnType(),
          false)),
        packet_count_storage_layer_(
        new column::NumericStorage<ColumnType::packet_count::non_optional_stored_type>(
          &packet_count_.vector(),
          ColumnTypeHelper<ColumnType::packet_count::stored_type>::ToColumnType(),
          false)),
        socket_tag_storage_layer_(
        new column::NumericStorage<ColumnType::socket_tag::non_optional_stored_type>(
          &socket_tag_.vector(),
          ColumnTypeHelper<ColumnType::socket_tag::stored_type>::ToColumnType(),
          false)),
        socket_tag_str_storage_layer_(
          new column::StringStorage(string_pool(), &socket_tag_str_.vector())),
        socket_uid_storage_layer_(
        new column::NumericStorage<ColumnType::socket_uid::non_optional_stored_type>(
          &socket_uid_.vector(),
          ColumnTypeHelper<ColumnType::socket_uid::stored_type>::ToColumnType(),
          false)),
        local_port_storage_layer_(
          new column::NumericStorage<ColumnType::local_port::non_optional_stored_type>(
            &local_port_.non_null_vector(),
            ColumnTypeHelper<ColumnType::local_port::stored_type>::ToColumnType(),
            false)),
        remote_port_storage_layer_(
          new column::NumericStorage<ColumnType::remote_port::non_optional_stored_type>(
            &remote_port_.non_null_vector(),
            ColumnTypeHelper<ColumnType::remote_port::stored_type>::ToColumnType(),
            false)),
        packet_icmp_type_storage_layer_(
          new column::NumericStorage<ColumnType::packet_icmp_type::non_optional_stored_type>(
            &packet_icmp_type_.non_null_vector(),
            ColumnTypeHelper<ColumnType::packet_icmp_type::stored_type>::ToColumnType(),
            false)),
        packet_icmp_code_storage_layer_(
          new column::NumericStorage<ColumnType::packet_icmp_code::non_optional_stored_type>(
            &packet_icmp_code_.non_null_vector(),
            ColumnTypeHelper<ColumnType::packet_icmp_code::stored_type>::ToColumnType(),
            false)),
        packet_tcp_flags_storage_layer_(
          new column::NumericStorage<ColumnType::packet_tcp_flags::non_optional_stored_type>(
            &packet_tcp_flags_.non_null_vector(),
            ColumnTypeHelper<ColumnType::packet_tcp_flags::stored_type>::ToColumnType(),
            false)),
        packet_tcp_flags_str_storage_layer_(
          new column::StringStorage(string_pool(), &packet_tcp_flags_str_.vector()))
,
        local_port_null_layer_(new column::NullOverlay(local_port_.bv())),
        remote_port_null_layer_(new column::NullOverlay(remote_port_.bv())),
        packet_icmp_type_null_layer_(new column::NullOverlay(packet_icmp_type_.bv())),
        packet_icmp_code_null_layer_(new column::NullOverlay(packet_icmp_code_.bv())),
        packet_tcp_flags_null_layer_(new column::NullOverlay(packet_tcp_flags_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::iface::stored_type>(
          ColumnFlag::iface),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::direction::stored_type>(
          ColumnFlag::direction),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_transport::stored_type>(
          ColumnFlag::packet_transport),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_length::stored_type>(
          ColumnFlag::packet_length),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_count::stored_type>(
          ColumnFlag::packet_count),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::socket_tag::stored_type>(
          ColumnFlag::socket_tag),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::socket_tag_str::stored_type>(
          ColumnFlag::socket_tag_str),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::socket_uid::stored_type>(
          ColumnFlag::socket_uid),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::local_port::stored_type>(
          ColumnFlag::local_port),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::remote_port::stored_type>(
          ColumnFlag::remote_port),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_icmp_type::stored_type>(
          ColumnFlag::packet_icmp_type),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_icmp_code::stored_type>(
          ColumnFlag::packet_icmp_code),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_tcp_flags::stored_type>(
          ColumnFlag::packet_tcp_flags),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_tcp_flags_str::stored_type>(
          ColumnFlag::packet_tcp_flags_str),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],iface_storage_layer_,direction_storage_layer_,packet_transport_storage_layer_,packet_length_storage_layer_,packet_count_storage_layer_,socket_tag_storage_layer_,socket_tag_str_storage_layer_,socket_uid_storage_layer_,local_port_storage_layer_,remote_port_storage_layer_,packet_icmp_type_storage_layer_,packet_icmp_code_storage_layer_,packet_tcp_flags_storage_layer_,packet_tcp_flags_str_storage_layer_},
      {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{},{},{},{},{},{},{},{},local_port_null_layer_,remote_port_null_layer_,packet_icmp_type_null_layer_,packet_icmp_code_null_layer_,packet_tcp_flags_null_layer_,{}});
  }
  ~AndroidNetworkPacketsTable() override;

  static const char* Name() { return "__intrinsic_android_network_packets"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "depth", ColumnType::depth::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stack_id", ColumnType::stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_stack_id", ColumnType::parent_stack_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "parent_id", ColumnType::parent_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_ts", ColumnType::thread_ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_dur", ColumnType::thread_dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_count", ColumnType::thread_instruction_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "thread_instruction_delta", ColumnType::thread_instruction_delta::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "iface", ColumnType::iface::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "direction", ColumnType::direction::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_transport", ColumnType::packet_transport::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_length", ColumnType::packet_length::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_count", ColumnType::packet_count::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "socket_tag", ColumnType::socket_tag::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "socket_tag_str", ColumnType::socket_tag_str::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "socket_uid", ColumnType::socket_uid::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "local_port", ColumnType::local_port::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "remote_port", ColumnType::remote_port::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_icmp_type", ColumnType::packet_icmp_type::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_icmp_code", ColumnType::packet_icmp_code::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_tcp_flags", ColumnType::packet_tcp_flags::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "packet_tcp_flags_str", ColumnType::packet_tcp_flags_str::SqlValueType(), false,
        false,
        false,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    iface_.ShrinkToFit();
    direction_.ShrinkToFit();
    packet_transport_.ShrinkToFit();
    packet_length_.ShrinkToFit();
    packet_count_.ShrinkToFit();
    socket_tag_.ShrinkToFit();
    socket_tag_str_.ShrinkToFit();
    socket_uid_.ShrinkToFit();
    local_port_.ShrinkToFit();
    remote_port_.ShrinkToFit();
    packet_icmp_type_.ShrinkToFit();
    packet_icmp_code_.ShrinkToFit();
    packet_tcp_flags_.ShrinkToFit();
    packet_tcp_flags_str_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{parent_->Insert(row).id};
    UpdateOverlaysAfterParentInsert();
    mutable_iface()->Append(row.iface);
    mutable_direction()->Append(row.direction);
    mutable_packet_transport()->Append(row.packet_transport);
    mutable_packet_length()->Append(row.packet_length);
    mutable_packet_count()->Append(row.packet_count);
    mutable_socket_tag()->Append(row.socket_tag);
    mutable_socket_tag_str()->Append(row.socket_tag_str);
    mutable_socket_uid()->Append(row.socket_uid);
    mutable_local_port()->Append(row.local_port);
    mutable_remote_port()->Append(row.remote_port);
    mutable_packet_icmp_type()->Append(row.packet_icmp_type);
    mutable_packet_icmp_code()->Append(row.packet_icmp_code);
    mutable_packet_tcp_flags()->Append(row.packet_tcp_flags);
    mutable_packet_tcp_flags_str()->Append(row.packet_tcp_flags_str);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  static std::unique_ptr<AndroidNetworkPacketsTable> ExtendParent(
      const SliceTable& parent,
      ColumnStorage<ColumnType::iface::stored_type> iface
, ColumnStorage<ColumnType::direction::stored_type> direction
, ColumnStorage<ColumnType::packet_transport::stored_type> packet_transport
, ColumnStorage<ColumnType::packet_length::stored_type> packet_length
, ColumnStorage<ColumnType::packet_count::stored_type> packet_count
, ColumnStorage<ColumnType::socket_tag::stored_type> socket_tag
, ColumnStorage<ColumnType::socket_tag_str::stored_type> socket_tag_str
, ColumnStorage<ColumnType::socket_uid::stored_type> socket_uid
, ColumnStorage<ColumnType::local_port::stored_type> local_port
, ColumnStorage<ColumnType::remote_port::stored_type> remote_port
, ColumnStorage<ColumnType::packet_icmp_type::stored_type> packet_icmp_type
, ColumnStorage<ColumnType::packet_icmp_code::stored_type> packet_icmp_code
, ColumnStorage<ColumnType::packet_tcp_flags::stored_type> packet_tcp_flags
, ColumnStorage<ColumnType::packet_tcp_flags_str::stored_type> packet_tcp_flags_str) {
    return std::unique_ptr<AndroidNetworkPacketsTable>(new AndroidNetworkPacketsTable(
        parent.string_pool(), parent, RowMap(0, parent.row_count()),
        std::move(iface), std::move(direction), std::move(packet_transport), std::move(packet_length), std::move(packet_count), std::move(socket_tag), std::move(socket_tag_str), std::move(socket_uid), std::move(local_port), std::move(remote_port), std::move(packet_icmp_type), std::move(packet_icmp_code), std::move(packet_tcp_flags), std::move(packet_tcp_flags_str)));
  }

  static std::unique_ptr<AndroidNetworkPacketsTable> SelectAndExtendParent(
      const SliceTable& parent,
      std::vector<SliceTable::RowNumber> parent_overlay,
      ColumnStorage<ColumnType::iface::stored_type> iface
, ColumnStorage<ColumnType::direction::stored_type> direction
, ColumnStorage<ColumnType::packet_transport::stored_type> packet_transport
, ColumnStorage<ColumnType::packet_length::stored_type> packet_length
, ColumnStorage<ColumnType::packet_count::stored_type> packet_count
, ColumnStorage<ColumnType::socket_tag::stored_type> socket_tag
, ColumnStorage<ColumnType::socket_tag_str::stored_type> socket_tag_str
, ColumnStorage<ColumnType::socket_uid::stored_type> socket_uid
, ColumnStorage<ColumnType::local_port::stored_type> local_port
, ColumnStorage<ColumnType::remote_port::stored_type> remote_port
, ColumnStorage<ColumnType::packet_icmp_type::stored_type> packet_icmp_type
, ColumnStorage<ColumnType::packet_icmp_code::stored_type> packet_icmp_code
, ColumnStorage<ColumnType::packet_tcp_flags::stored_type> packet_tcp_flags
, ColumnStorage<ColumnType::packet_tcp_flags_str::stored_type> packet_tcp_flags_str) {
    std::vector<uint32_t> prs_untyped(parent_overlay.size());
    for (uint32_t i = 0; i < parent_overlay.size(); ++i) {
      prs_untyped[i] = parent_overlay[i].row_number();
    }
    return std::unique_ptr<AndroidNetworkPacketsTable>(new AndroidNetworkPacketsTable(
        parent.string_pool(), parent, RowMap(std::move(prs_untyped)),
        std::move(iface), std::move(direction), std::move(packet_transport), std::move(packet_length), std::move(packet_count), std::move(socket_tag), std::move(socket_tag_str), std::move(socket_uid), std::move(local_port), std::move(remote_port), std::move(packet_icmp_type), std::move(packet_icmp_code), std::move(packet_tcp_flags), std::move(packet_tcp_flags_str)));
  }

  const IdColumn<AndroidNetworkPacketsTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<uint32_t>& depth() const {
    return static_cast<const ColumnType::depth&>(columns()[ColumnIndex::depth]);
  }
  const TypedColumn<int64_t>& stack_id() const {
    return static_cast<const ColumnType::stack_id&>(columns()[ColumnIndex::stack_id]);
  }
  const TypedColumn<int64_t>& parent_stack_id() const {
    return static_cast<const ColumnType::parent_stack_id&>(columns()[ColumnIndex::parent_stack_id]);
  }
  const TypedColumn<std::optional<AndroidNetworkPacketsTable::Id>>& parent_id() const {
    return static_cast<const ColumnType::parent_id&>(columns()[ColumnIndex::parent_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_ts() const {
    return static_cast<const ColumnType::thread_ts&>(columns()[ColumnIndex::thread_ts]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_dur() const {
    return static_cast<const ColumnType::thread_dur&>(columns()[ColumnIndex::thread_dur]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_count() const {
    return static_cast<const ColumnType::thread_instruction_count&>(columns()[ColumnIndex::thread_instruction_count]);
  }
  const TypedColumn<std::optional<int64_t>>& thread_instruction_delta() const {
    return static_cast<const ColumnType::thread_instruction_delta&>(columns()[ColumnIndex::thread_instruction_delta]);
  }
  const TypedColumn<StringPool::Id>& iface() const {
    return static_cast<const ColumnType::iface&>(columns()[ColumnIndex::iface]);
  }
  const TypedColumn<StringPool::Id>& direction() const {
    return static_cast<const ColumnType::direction&>(columns()[ColumnIndex::direction]);
  }
  const TypedColumn<StringPool::Id>& packet_transport() const {
    return static_cast<const ColumnType::packet_transport&>(columns()[ColumnIndex::packet_transport]);
  }
  const TypedColumn<int64_t>& packet_length() const {
    return static_cast<const ColumnType::packet_length&>(columns()[ColumnIndex::packet_length]);
  }
  const TypedColumn<int64_t>& packet_count() const {
    return static_cast<const ColumnType::packet_count&>(columns()[ColumnIndex::packet_count]);
  }
  const TypedColumn<uint32_t>& socket_tag() const {
    return static_cast<const ColumnType::socket_tag&>(columns()[ColumnIndex::socket_tag]);
  }
  const TypedColumn<StringPool::Id>& socket_tag_str() const {
    return static_cast<const ColumnType::socket_tag_str&>(columns()[ColumnIndex::socket_tag_str]);
  }
  const TypedColumn<uint32_t>& socket_uid() const {
    return static_cast<const ColumnType::socket_uid&>(columns()[ColumnIndex::socket_uid]);
  }
  const TypedColumn<std::optional<uint32_t>>& local_port() const {
    return static_cast<const ColumnType::local_port&>(columns()[ColumnIndex::local_port]);
  }
  const TypedColumn<std::optional<uint32_t>>& remote_port() const {
    return static_cast<const ColumnType::remote_port&>(columns()[ColumnIndex::remote_port]);
  }
  const TypedColumn<std::optional<uint32_t>>& packet_icmp_type() const {
    return static_cast<const ColumnType::packet_icmp_type&>(columns()[ColumnIndex::packet_icmp_type]);
  }
  const TypedColumn<std::optional<uint32_t>>& packet_icmp_code() const {
    return static_cast<const ColumnType::packet_icmp_code&>(columns()[ColumnIndex::packet_icmp_code]);
  }
  const TypedColumn<std::optional<uint32_t>>& packet_tcp_flags() const {
    return static_cast<const ColumnType::packet_tcp_flags&>(columns()[ColumnIndex::packet_tcp_flags]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& packet_tcp_flags_str() const {
    return static_cast<const ColumnType::packet_tcp_flags_str&>(columns()[ColumnIndex::packet_tcp_flags_str]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<uint32_t>* mutable_depth() {
    return static_cast<ColumnType::depth*>(
        GetColumn(ColumnIndex::depth));
  }
  TypedColumn<int64_t>* mutable_stack_id() {
    return static_cast<ColumnType::stack_id*>(
        GetColumn(ColumnIndex::stack_id));
  }
  TypedColumn<int64_t>* mutable_parent_stack_id() {
    return static_cast<ColumnType::parent_stack_id*>(
        GetColumn(ColumnIndex::parent_stack_id));
  }
  TypedColumn<std::optional<AndroidNetworkPacketsTable::Id>>* mutable_parent_id() {
    return static_cast<ColumnType::parent_id*>(
        GetColumn(ColumnIndex::parent_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_ts() {
    return static_cast<ColumnType::thread_ts*>(
        GetColumn(ColumnIndex::thread_ts));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_dur() {
    return static_cast<ColumnType::thread_dur*>(
        GetColumn(ColumnIndex::thread_dur));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_count() {
    return static_cast<ColumnType::thread_instruction_count*>(
        GetColumn(ColumnIndex::thread_instruction_count));
  }
  TypedColumn<std::optional<int64_t>>* mutable_thread_instruction_delta() {
    return static_cast<ColumnType::thread_instruction_delta*>(
        GetColumn(ColumnIndex::thread_instruction_delta));
  }
  TypedColumn<StringPool::Id>* mutable_iface() {
    return static_cast<ColumnType::iface*>(
        GetColumn(ColumnIndex::iface));
  }
  TypedColumn<StringPool::Id>* mutable_direction() {
    return static_cast<ColumnType::direction*>(
        GetColumn(ColumnIndex::direction));
  }
  TypedColumn<StringPool::Id>* mutable_packet_transport() {
    return static_cast<ColumnType::packet_transport*>(
        GetColumn(ColumnIndex::packet_transport));
  }
  TypedColumn<int64_t>* mutable_packet_length() {
    return static_cast<ColumnType::packet_length*>(
        GetColumn(ColumnIndex::packet_length));
  }
  TypedColumn<int64_t>* mutable_packet_count() {
    return static_cast<ColumnType::packet_count*>(
        GetColumn(ColumnIndex::packet_count));
  }
  TypedColumn<uint32_t>* mutable_socket_tag() {
    return static_cast<ColumnType::socket_tag*>(
        GetColumn(ColumnIndex::socket_tag));
  }
  TypedColumn<StringPool::Id>* mutable_socket_tag_str() {
    return static_cast<ColumnType::socket_tag_str*>(
        GetColumn(ColumnIndex::socket_tag_str));
  }
  TypedColumn<uint32_t>* mutable_socket_uid() {
    return static_cast<ColumnType::socket_uid*>(
        GetColumn(ColumnIndex::socket_uid));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_local_port() {
    return static_cast<ColumnType::local_port*>(
        GetColumn(ColumnIndex::local_port));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_remote_port() {
    return static_cast<ColumnType::remote_port*>(
        GetColumn(ColumnIndex::remote_port));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_packet_icmp_type() {
    return static_cast<ColumnType::packet_icmp_type*>(
        GetColumn(ColumnIndex::packet_icmp_type));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_packet_icmp_code() {
    return static_cast<ColumnType::packet_icmp_code*>(
        GetColumn(ColumnIndex::packet_icmp_code));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_packet_tcp_flags() {
    return static_cast<ColumnType::packet_tcp_flags*>(
        GetColumn(ColumnIndex::packet_tcp_flags));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_packet_tcp_flags_str() {
    return static_cast<ColumnType::packet_tcp_flags_str*>(
        GetColumn(ColumnIndex::packet_tcp_flags_str));
  }

 private:
  AndroidNetworkPacketsTable(StringPool* pool,
            const SliceTable& parent,
            const RowMap& parent_overlay,
            ColumnStorage<ColumnType::iface::stored_type> iface
, ColumnStorage<ColumnType::direction::stored_type> direction
, ColumnStorage<ColumnType::packet_transport::stored_type> packet_transport
, ColumnStorage<ColumnType::packet_length::stored_type> packet_length
, ColumnStorage<ColumnType::packet_count::stored_type> packet_count
, ColumnStorage<ColumnType::socket_tag::stored_type> socket_tag
, ColumnStorage<ColumnType::socket_tag_str::stored_type> socket_tag_str
, ColumnStorage<ColumnType::socket_uid::stored_type> socket_uid
, ColumnStorage<ColumnType::local_port::stored_type> local_port
, ColumnStorage<ColumnType::remote_port::stored_type> remote_port
, ColumnStorage<ColumnType::packet_icmp_type::stored_type> packet_icmp_type
, ColumnStorage<ColumnType::packet_icmp_code::stored_type> packet_icmp_code
, ColumnStorage<ColumnType::packet_tcp_flags::stored_type> packet_tcp_flags
, ColumnStorage<ColumnType::packet_tcp_flags_str::stored_type> packet_tcp_flags_str)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, &parent),
          parent,
          parent_overlay),
          const_parent_(&parent)
,
        iface_storage_layer_(
          new column::StringStorage(string_pool(), &iface_.vector())),
        direction_storage_layer_(
          new column::StringStorage(string_pool(), &direction_.vector())),
        packet_transport_storage_layer_(
          new column::StringStorage(string_pool(), &packet_transport_.vector())),
        packet_length_storage_layer_(
        new column::NumericStorage<ColumnType::packet_length::non_optional_stored_type>(
          &packet_length_.vector(),
          ColumnTypeHelper<ColumnType::packet_length::stored_type>::ToColumnType(),
          false)),
        packet_count_storage_layer_(
        new column::NumericStorage<ColumnType::packet_count::non_optional_stored_type>(
          &packet_count_.vector(),
          ColumnTypeHelper<ColumnType::packet_count::stored_type>::ToColumnType(),
          false)),
        socket_tag_storage_layer_(
        new column::NumericStorage<ColumnType::socket_tag::non_optional_stored_type>(
          &socket_tag_.vector(),
          ColumnTypeHelper<ColumnType::socket_tag::stored_type>::ToColumnType(),
          false)),
        socket_tag_str_storage_layer_(
          new column::StringStorage(string_pool(), &socket_tag_str_.vector())),
        socket_uid_storage_layer_(
        new column::NumericStorage<ColumnType::socket_uid::non_optional_stored_type>(
          &socket_uid_.vector(),
          ColumnTypeHelper<ColumnType::socket_uid::stored_type>::ToColumnType(),
          false)),
        local_port_storage_layer_(
          new column::NumericStorage<ColumnType::local_port::non_optional_stored_type>(
            &local_port_.non_null_vector(),
            ColumnTypeHelper<ColumnType::local_port::stored_type>::ToColumnType(),
            false)),
        remote_port_storage_layer_(
          new column::NumericStorage<ColumnType::remote_port::non_optional_stored_type>(
            &remote_port_.non_null_vector(),
            ColumnTypeHelper<ColumnType::remote_port::stored_type>::ToColumnType(),
            false)),
        packet_icmp_type_storage_layer_(
          new column::NumericStorage<ColumnType::packet_icmp_type::non_optional_stored_type>(
            &packet_icmp_type_.non_null_vector(),
            ColumnTypeHelper<ColumnType::packet_icmp_type::stored_type>::ToColumnType(),
            false)),
        packet_icmp_code_storage_layer_(
          new column::NumericStorage<ColumnType::packet_icmp_code::non_optional_stored_type>(
            &packet_icmp_code_.non_null_vector(),
            ColumnTypeHelper<ColumnType::packet_icmp_code::stored_type>::ToColumnType(),
            false)),
        packet_tcp_flags_storage_layer_(
          new column::NumericStorage<ColumnType::packet_tcp_flags::non_optional_stored_type>(
            &packet_tcp_flags_.non_null_vector(),
            ColumnTypeHelper<ColumnType::packet_tcp_flags::stored_type>::ToColumnType(),
            false)),
        packet_tcp_flags_str_storage_layer_(
          new column::StringStorage(string_pool(), &packet_tcp_flags_str_.vector()))
,
        local_port_null_layer_(new column::NullOverlay(local_port_.bv())),
        remote_port_null_layer_(new column::NullOverlay(remote_port_.bv())),
        packet_icmp_type_null_layer_(new column::NullOverlay(packet_icmp_type_.bv())),
        packet_icmp_code_null_layer_(new column::NullOverlay(packet_icmp_code_.bv())),
        packet_tcp_flags_null_layer_(new column::NullOverlay(packet_tcp_flags_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::iface::stored_type>(
          ColumnFlag::iface),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::direction::stored_type>(
          ColumnFlag::direction),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_transport::stored_type>(
          ColumnFlag::packet_transport),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_length::stored_type>(
          ColumnFlag::packet_length),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_count::stored_type>(
          ColumnFlag::packet_count),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::socket_tag::stored_type>(
          ColumnFlag::socket_tag),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::socket_tag_str::stored_type>(
          ColumnFlag::socket_tag_str),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::socket_uid::stored_type>(
          ColumnFlag::socket_uid),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::local_port::stored_type>(
          ColumnFlag::local_port),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::remote_port::stored_type>(
          ColumnFlag::remote_port),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_icmp_type::stored_type>(
          ColumnFlag::packet_icmp_type),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_icmp_code::stored_type>(
          ColumnFlag::packet_icmp_code),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_tcp_flags::stored_type>(
          ColumnFlag::packet_tcp_flags),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::packet_tcp_flags_str::stored_type>(
          ColumnFlag::packet_tcp_flags_str),
        "Column type and flag combination is not valid");
    PERFETTO_DCHECK(iface.size() == parent_overlay.size());
    iface_ = std::move(iface);
    PERFETTO_DCHECK(direction.size() == parent_overlay.size());
    direction_ = std::move(direction);
    PERFETTO_DCHECK(packet_transport.size() == parent_overlay.size());
    packet_transport_ = std::move(packet_transport);
    PERFETTO_DCHECK(packet_length.size() == parent_overlay.size());
    packet_length_ = std::move(packet_length);
    PERFETTO_DCHECK(packet_count.size() == parent_overlay.size());
    packet_count_ = std::move(packet_count);
    PERFETTO_DCHECK(socket_tag.size() == parent_overlay.size());
    socket_tag_ = std::move(socket_tag);
    PERFETTO_DCHECK(socket_tag_str.size() == parent_overlay.size());
    socket_tag_str_ = std::move(socket_tag_str);
    PERFETTO_DCHECK(socket_uid.size() == parent_overlay.size());
    socket_uid_ = std::move(socket_uid);
    PERFETTO_DCHECK(local_port.size() == parent_overlay.size());
    local_port_ = std::move(local_port);
    PERFETTO_DCHECK(remote_port.size() == parent_overlay.size());
    remote_port_ = std::move(remote_port);
    PERFETTO_DCHECK(packet_icmp_type.size() == parent_overlay.size());
    packet_icmp_type_ = std::move(packet_icmp_type);
    PERFETTO_DCHECK(packet_icmp_code.size() == parent_overlay.size());
    packet_icmp_code_ = std::move(packet_icmp_code);
    PERFETTO_DCHECK(packet_tcp_flags.size() == parent_overlay.size());
    packet_tcp_flags_ = std::move(packet_tcp_flags);
    PERFETTO_DCHECK(packet_tcp_flags_str.size() == parent_overlay.size());
    packet_tcp_flags_str_ = std::move(packet_tcp_flags_str);

    std::vector<RefPtr<column::OverlayLayer>> overlay_layers(OverlayCount(&parent) + 1);
    for (uint32_t i = 0; i < overlay_layers.size(); ++i) {
      if (overlays()[i].row_map().IsIndexVector()) {
        overlay_layers[i].reset(new column::ArrangementOverlay(
            overlays()[i].row_map().GetIfIndexVector(),
            column::DataLayerChain::Indices::State::kNonmonotonic));
      } else if (overlays()[i].row_map().IsBitVector()) {
        overlay_layers[i].reset(new column::SelectorOverlay(
            overlays()[i].row_map().GetIfBitVector()));
      } else if (overlays()[i].row_map().IsRange()) {
        overlay_layers[i].reset(new column::RangeOverlay(
            overlays()[i].row_map().GetIfIRange()));
      }
    }

    OnConstructionCompleted(
      {const_parent_->storage_layers()[ColumnIndex::id],const_parent_->storage_layers()[ColumnIndex::ts],const_parent_->storage_layers()[ColumnIndex::dur],const_parent_->storage_layers()[ColumnIndex::track_id],const_parent_->storage_layers()[ColumnIndex::category],const_parent_->storage_layers()[ColumnIndex::name],const_parent_->storage_layers()[ColumnIndex::depth],const_parent_->storage_layers()[ColumnIndex::stack_id],const_parent_->storage_layers()[ColumnIndex::parent_stack_id],const_parent_->storage_layers()[ColumnIndex::parent_id],const_parent_->storage_layers()[ColumnIndex::arg_set_id],const_parent_->storage_layers()[ColumnIndex::thread_ts],const_parent_->storage_layers()[ColumnIndex::thread_dur],const_parent_->storage_layers()[ColumnIndex::thread_instruction_count],const_parent_->storage_layers()[ColumnIndex::thread_instruction_delta],iface_storage_layer_,direction_storage_layer_,packet_transport_storage_layer_,packet_length_storage_layer_,packet_count_storage_layer_,socket_tag_storage_layer_,socket_tag_str_storage_layer_,socket_uid_storage_layer_,local_port_storage_layer_,remote_port_storage_layer_,packet_icmp_type_storage_layer_,packet_icmp_code_storage_layer_,packet_tcp_flags_storage_layer_,packet_tcp_flags_str_storage_layer_}, {{},{},{},{},{},{},{},{},{},const_parent_->null_layers()[ColumnIndex::parent_id],const_parent_->null_layers()[ColumnIndex::arg_set_id],const_parent_->null_layers()[ColumnIndex::thread_ts],const_parent_->null_layers()[ColumnIndex::thread_dur],const_parent_->null_layers()[ColumnIndex::thread_instruction_count],const_parent_->null_layers()[ColumnIndex::thread_instruction_delta],{},{},{},{},{},{},{},{},local_port_null_layer_,remote_port_null_layer_,packet_icmp_type_null_layer_,packet_icmp_code_null_layer_,packet_tcp_flags_null_layer_,{}}, std::move(overlay_layers));
  }
  SliceTable* parent_ = nullptr;
  const SliceTable* const_parent_ = nullptr;
  ColumnStorage<ColumnType::iface::stored_type> iface_;
  ColumnStorage<ColumnType::direction::stored_type> direction_;
  ColumnStorage<ColumnType::packet_transport::stored_type> packet_transport_;
  ColumnStorage<ColumnType::packet_length::stored_type> packet_length_;
  ColumnStorage<ColumnType::packet_count::stored_type> packet_count_;
  ColumnStorage<ColumnType::socket_tag::stored_type> socket_tag_;
  ColumnStorage<ColumnType::socket_tag_str::stored_type> socket_tag_str_;
  ColumnStorage<ColumnType::socket_uid::stored_type> socket_uid_;
  ColumnStorage<ColumnType::local_port::stored_type> local_port_;
  ColumnStorage<ColumnType::remote_port::stored_type> remote_port_;
  ColumnStorage<ColumnType::packet_icmp_type::stored_type> packet_icmp_type_;
  ColumnStorage<ColumnType::packet_icmp_code::stored_type> packet_icmp_code_;
  ColumnStorage<ColumnType::packet_tcp_flags::stored_type> packet_tcp_flags_;
  ColumnStorage<ColumnType::packet_tcp_flags_str::stored_type> packet_tcp_flags_str_;

  RefPtr<column::StorageLayer> iface_storage_layer_;
  RefPtr<column::StorageLayer> direction_storage_layer_;
  RefPtr<column::StorageLayer> packet_transport_storage_layer_;
  RefPtr<column::StorageLayer> packet_length_storage_layer_;
  RefPtr<column::StorageLayer> packet_count_storage_layer_;
  RefPtr<column::StorageLayer> socket_tag_storage_layer_;
  RefPtr<column::StorageLayer> socket_tag_str_storage_layer_;
  RefPtr<column::StorageLayer> socket_uid_storage_layer_;
  RefPtr<column::StorageLayer> local_port_storage_layer_;
  RefPtr<column::StorageLayer> remote_port_storage_layer_;
  RefPtr<column::StorageLayer> packet_icmp_type_storage_layer_;
  RefPtr<column::StorageLayer> packet_icmp_code_storage_layer_;
  RefPtr<column::StorageLayer> packet_tcp_flags_storage_layer_;
  RefPtr<column::StorageLayer> packet_tcp_flags_str_storage_layer_;

  RefPtr<column::OverlayLayer> local_port_null_layer_;
  RefPtr<column::OverlayLayer> remote_port_null_layer_;
  RefPtr<column::OverlayLayer> packet_icmp_type_null_layer_;
  RefPtr<column::OverlayLayer> packet_icmp_code_null_layer_;
  RefPtr<column::OverlayLayer> packet_tcp_flags_null_layer_;
};
  

class ExperimentalFlatSliceTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 10;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t dur = 2;
    static constexpr uint32_t track_id = 3;
    static constexpr uint32_t category = 4;
    static constexpr uint32_t name = 5;
    static constexpr uint32_t arg_set_id = 6;
    static constexpr uint32_t source_id = 7;
    static constexpr uint32_t start_bound = 8;
    static constexpr uint32_t end_bound = 9;
  };
  struct ColumnType {
    using id = IdColumn<ExperimentalFlatSliceTable::Id>;
    using ts = TypedColumn<int64_t>;
    using dur = TypedColumn<int64_t>;
    using track_id = TypedColumn<TrackTable::Id>;
    using category = TypedColumn<std::optional<StringPool::Id>>;
    using name = TypedColumn<std::optional<StringPool::Id>>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using source_id = TypedColumn<std::optional<SliceTable::Id>>;
    using start_bound = TypedColumn<int64_t>;
    using end_bound = TypedColumn<int64_t>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_dur = {},
        TrackTable::Id in_track_id = {},
        std::optional<StringPool::Id> in_category = {},
        std::optional<StringPool::Id> in_name = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<SliceTable::Id> in_source_id = {},
        int64_t in_start_bound = {},
        int64_t in_end_bound = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          dur(in_dur),
          track_id(in_track_id),
          category(in_category),
          name(in_name),
          arg_set_id(in_arg_set_id),
          source_id(in_source_id),
          start_bound(in_start_bound),
          end_bound(in_end_bound) {}
    int64_t ts;
    int64_t dur;
    TrackTable::Id track_id;
    std::optional<StringPool::Id> category;
    std::optional<StringPool::Id> name;
    std::optional<uint32_t> arg_set_id;
    std::optional<SliceTable::Id> source_id;
    int64_t start_bound;
    int64_t end_bound;

    bool operator==(const ExperimentalFlatSliceTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::dur::Equals(dur, other.dur) &&
       ColumnType::track_id::Equals(track_id, other.track_id) &&
       ColumnType::category::Equals(category, other.category) &&
       ColumnType::name::Equals(name, other.name) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::source_id::Equals(source_id, other.source_id) &&
       ColumnType::start_bound::Equals(start_bound, other.start_bound) &&
       ColumnType::end_bound::Equals(end_bound, other.end_bound);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = ColumnType::ts::default_flags();
    static constexpr uint32_t dur = ColumnType::dur::default_flags();
    static constexpr uint32_t track_id = ColumnType::track_id::default_flags();
    static constexpr uint32_t category = ColumnType::category::default_flags();
    static constexpr uint32_t name = ColumnType::name::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t source_id = ColumnType::source_id::default_flags();
    static constexpr uint32_t start_bound = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::start_bound::default_flags();
    static constexpr uint32_t end_bound = static_cast<uint32_t>(ColumnLegacy::Flag::kHidden) | ColumnType::end_bound::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ExperimentalFlatSliceTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ExperimentalFlatSliceTable, RowNumber> {
   public:
    ConstRowReference(const ExperimentalFlatSliceTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::dur::type dur() const {
      return table()->dur()[row_number_];
    }
    ColumnType::track_id::type track_id() const {
      return table()->track_id()[row_number_];
    }
    ColumnType::category::type category() const {
      return table()->category()[row_number_];
    }
    ColumnType::name::type name() const {
      return table()->name()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::source_id::type source_id() const {
      return table()->source_id()[row_number_];
    }
    ColumnType::start_bound::type start_bound() const {
      return table()->start_bound()[row_number_];
    }
    ColumnType::end_bound::type end_bound() const {
      return table()->end_bound()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ExperimentalFlatSliceTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_dur(
        ColumnType::dur::non_optional_type v) {
      return mutable_table()->mutable_dur()->Set(row_number_, v);
    }
    void set_track_id(
        ColumnType::track_id::non_optional_type v) {
      return mutable_table()->mutable_track_id()->Set(row_number_, v);
    }
    void set_category(
        ColumnType::category::non_optional_type v) {
      return mutable_table()->mutable_category()->Set(row_number_, v);
    }
    void set_name(
        ColumnType::name::non_optional_type v) {
      return mutable_table()->mutable_name()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_source_id(
        ColumnType::source_id::non_optional_type v) {
      return mutable_table()->mutable_source_id()->Set(row_number_, v);
    }
    void set_start_bound(
        ColumnType::start_bound::non_optional_type v) {
      return mutable_table()->mutable_start_bound()->Set(row_number_, v);
    }
    void set_end_bound(
        ColumnType::end_bound::non_optional_type v) {
      return mutable_table()->mutable_end_bound()->Set(row_number_, v);
    }

   private:
    ExperimentalFlatSliceTable* mutable_table() const {
      return const_cast<ExperimentalFlatSliceTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ExperimentalFlatSliceTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::ts::type ts() const {
      const auto& col = table()->ts();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::dur::type dur() const {
      const auto& col = table()->dur();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::track_id::type track_id() const {
      const auto& col = table()->track_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::category::type category() const {
      const auto& col = table()->category();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::name::type name() const {
      const auto& col = table()->name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::source_id::type source_id() const {
      const auto& col = table()->source_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::start_bound::type start_bound() const {
      const auto& col = table()->start_bound();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::end_bound::type end_bound() const {
      const auto& col = table()->end_bound();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ExperimentalFlatSliceTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ExperimentalFlatSliceTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ExperimentalFlatSliceTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ExperimentalFlatSliceTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ExperimentalFlatSliceTable;

     explicit Iterator(ExperimentalFlatSliceTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ExperimentalFlatSliceTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "dur", &self->dur_, ColumnFlag::dur,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "track_id", &self->track_id_, ColumnFlag::track_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "category", &self->category_, ColumnFlag::category,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "name", &self->name_, ColumnFlag::name,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "source_id", &self->source_id_, ColumnFlag::source_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "start_bound", &self->start_bound_, ColumnFlag::start_bound,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "end_bound", &self->end_bound_, ColumnFlag::end_bound,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ExperimentalFlatSliceTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        dur_(ColumnStorage<ColumnType::dur::stored_type>::Create<false>()),
        track_id_(ColumnStorage<ColumnType::track_id::stored_type>::Create<false>()),
        category_(ColumnStorage<ColumnType::category::stored_type>::Create<false>()),
        name_(ColumnStorage<ColumnType::name::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        source_id_(ColumnStorage<ColumnType::source_id::stored_type>::Create<false>()),
        start_bound_(ColumnStorage<ColumnType::start_bound::stored_type>::Create<false>()),
        end_bound_(ColumnStorage<ColumnType::end_bound::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          false)),
        dur_storage_layer_(
        new column::NumericStorage<ColumnType::dur::non_optional_stored_type>(
          &dur_.vector(),
          ColumnTypeHelper<ColumnType::dur::stored_type>::ToColumnType(),
          false)),
        track_id_storage_layer_(
        new column::NumericStorage<ColumnType::track_id::non_optional_stored_type>(
          &track_id_.vector(),
          ColumnTypeHelper<ColumnType::track_id::stored_type>::ToColumnType(),
          false)),
        category_storage_layer_(
          new column::StringStorage(string_pool(), &category_.vector())),
        name_storage_layer_(
          new column::StringStorage(string_pool(), &name_.vector())),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        source_id_storage_layer_(
          new column::NumericStorage<ColumnType::source_id::non_optional_stored_type>(
            &source_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::source_id::stored_type>::ToColumnType(),
            false)),
        start_bound_storage_layer_(
        new column::NumericStorage<ColumnType::start_bound::non_optional_stored_type>(
          &start_bound_.vector(),
          ColumnTypeHelper<ColumnType::start_bound::stored_type>::ToColumnType(),
          false)),
        end_bound_storage_layer_(
        new column::NumericStorage<ColumnType::end_bound::non_optional_stored_type>(
          &end_bound_.vector(),
          ColumnTypeHelper<ColumnType::end_bound::stored_type>::ToColumnType(),
          false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        source_id_null_layer_(new column::NullOverlay(source_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::dur::stored_type>(
          ColumnFlag::dur),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::track_id::stored_type>(
          ColumnFlag::track_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::category::stored_type>(
          ColumnFlag::category),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::name::stored_type>(
          ColumnFlag::name),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::source_id::stored_type>(
          ColumnFlag::source_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::start_bound::stored_type>(
          ColumnFlag::start_bound),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::end_bound::stored_type>(
          ColumnFlag::end_bound),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,dur_storage_layer_,track_id_storage_layer_,category_storage_layer_,name_storage_layer_,arg_set_id_storage_layer_,source_id_storage_layer_,start_bound_storage_layer_,end_bound_storage_layer_},
      {{},{},{},{},{},{},arg_set_id_null_layer_,source_id_null_layer_,{},{}});
  }
  ~ExperimentalFlatSliceTable() override;

  static const char* Name() { return "experimental_flat_slice"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "ts", ColumnType::ts::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "dur", ColumnType::dur::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "track_id", ColumnType::track_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "category", ColumnType::category::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "name", ColumnType::name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "source_id", ColumnType::source_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "start_bound", ColumnType::start_bound::SqlValueType(), false,
        false,
        true,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "end_bound", ColumnType::end_bound::SqlValueType(), false,
        false,
        true,
        false});
    return schema;
  }

  ConstIterator IterateRows() const {
    return ConstIterator(this, Table::IterateRows());
  }

  Iterator IterateRows() { return Iterator(this, Table::IterateRows()); }

  ConstIterator FilterToIterator(const Query& q) const {
    return ConstIterator(this, QueryToIterator(q));
  }

  Iterator FilterToIterator(const Query& q) {
    return Iterator(this, QueryToIterator(q));
  }

  void ShrinkToFit() {
    ts_.ShrinkToFit();
    dur_.ShrinkToFit();
    track_id_.ShrinkToFit();
    category_.ShrinkToFit();
    name_.ShrinkToFit();
    arg_set_id_.ShrinkToFit();
    source_id_.ShrinkToFit();
    start_bound_.ShrinkToFit();
    end_bound_.ShrinkToFit();
  }

  ConstRowReference operator[](uint32_t r) const {
    return ConstRowReference(this, r);
  }
  RowReference operator[](uint32_t r) { return RowReference(this, r); }
  ConstRowReference operator[](RowNumber r) const {
    return ConstRowReference(this, r.row_number());
  }
  RowReference operator[](RowNumber r) {
    return RowReference(this, r.row_number());
  }

  std::optional<ConstRowReference> FindById(Id find_id) const {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(ConstRowReference(this, *row))
               : std::nullopt;
  }

  std::optional<RowReference> FindById(Id find_id) {
    std::optional<uint32_t> row = id().IndexOf(find_id);
    return row ? std::make_optional(RowReference(this, *row)) : std::nullopt;
  }

  IdAndRow Insert(const Row& row) {
    uint32_t row_number = row_count();
    Id id = Id{row_number};
    mutable_ts()->Append(row.ts);
    mutable_dur()->Append(row.dur);
    mutable_track_id()->Append(row.track_id);
    mutable_category()->Append(row.category);
    mutable_name()->Append(row.name);
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_source_id()->Append(row.source_id);
    mutable_start_bound()->Append(row.start_bound);
    mutable_end_bound()->Append(row.end_bound);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<ExperimentalFlatSliceTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& dur() const {
    return static_cast<const ColumnType::dur&>(columns()[ColumnIndex::dur]);
  }
  const TypedColumn<TrackTable::Id>& track_id() const {
    return static_cast<const ColumnType::track_id&>(columns()[ColumnIndex::track_id]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& category() const {
    return static_cast<const ColumnType::category&>(columns()[ColumnIndex::category]);
  }
  const TypedColumn<std::optional<StringPool::Id>>& name() const {
    return static_cast<const ColumnType::name&>(columns()[ColumnIndex::name]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<SliceTable::Id>>& source_id() const {
    return static_cast<const ColumnType::source_id&>(columns()[ColumnIndex::source_id]);
  }
  const TypedColumn<int64_t>& start_bound() const {
    return static_cast<const ColumnType::start_bound&>(columns()[ColumnIndex::start_bound]);
  }
  const TypedColumn<int64_t>& end_bound() const {
    return static_cast<const ColumnType::end_bound&>(columns()[ColumnIndex::end_bound]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_dur() {
    return static_cast<ColumnType::dur*>(
        GetColumn(ColumnIndex::dur));
  }
  TypedColumn<TrackTable::Id>* mutable_track_id() {
    return static_cast<ColumnType::track_id*>(
        GetColumn(ColumnIndex::track_id));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_category() {
    return static_cast<ColumnType::category*>(
        GetColumn(ColumnIndex::category));
  }
  TypedColumn<std::optional<StringPool::Id>>* mutable_name() {
    return static_cast<ColumnType::name*>(
        GetColumn(ColumnIndex::name));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<SliceTable::Id>>* mutable_source_id() {
    return static_cast<ColumnType::source_id*>(
        GetColumn(ColumnIndex::source_id));
  }
  TypedColumn<int64_t>* mutable_start_bound() {
    return static_cast<ColumnType::start_bound*>(
        GetColumn(ColumnIndex::start_bound));
  }
  TypedColumn<int64_t>* mutable_end_bound() {
    return static_cast<ColumnType::end_bound*>(
        GetColumn(ColumnIndex::end_bound));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::dur::stored_type> dur_;
  ColumnStorage<ColumnType::track_id::stored_type> track_id_;
  ColumnStorage<ColumnType::category::stored_type> category_;
  ColumnStorage<ColumnType::name::stored_type> name_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::source_id::stored_type> source_id_;
  ColumnStorage<ColumnType::start_bound::stored_type> start_bound_;
  ColumnStorage<ColumnType::end_bound::stored_type> end_bound_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> dur_storage_layer_;
  RefPtr<column::StorageLayer> track_id_storage_layer_;
  RefPtr<column::StorageLayer> category_storage_layer_;
  RefPtr<column::StorageLayer> name_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> source_id_storage_layer_;
  RefPtr<column::StorageLayer> start_bound_storage_layer_;
  RefPtr<column::StorageLayer> end_bound_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> source_id_null_layer_;
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_TABLES_SLICE_TABLES_PY_H_
