#ifndef SRC_TRACE_PROCESSOR_TABLES_WINSCOPE_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_WINSCOPE_TABLES_PY_H_

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



namespace perfetto::trace_processor::tables {

class ProtoLogTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 7;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t level = 2;
    static constexpr uint32_t tag = 3;
    static constexpr uint32_t message = 4;
    static constexpr uint32_t stacktrace = 5;
    static constexpr uint32_t location = 6;
  };
  struct ColumnType {
    using id = IdColumn<ProtoLogTable::Id>;
    using ts = TypedColumn<int64_t>;
    using level = TypedColumn<StringPool::Id>;
    using tag = TypedColumn<StringPool::Id>;
    using message = TypedColumn<StringPool::Id>;
    using stacktrace = TypedColumn<StringPool::Id>;
    using location = TypedColumn<StringPool::Id>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        StringPool::Id in_level = {},
        StringPool::Id in_tag = {},
        StringPool::Id in_message = {},
        StringPool::Id in_stacktrace = {},
        StringPool::Id in_location = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          level(in_level),
          tag(in_tag),
          message(in_message),
          stacktrace(in_stacktrace),
          location(in_location) {}
    int64_t ts;
    StringPool::Id level;
    StringPool::Id tag;
    StringPool::Id message;
    StringPool::Id stacktrace;
    StringPool::Id location;

    bool operator==(const ProtoLogTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::level::Equals(level, other.level) &&
       ColumnType::tag::Equals(tag, other.tag) &&
       ColumnType::message::Equals(message, other.message) &&
       ColumnType::stacktrace::Equals(stacktrace, other.stacktrace) &&
       ColumnType::location::Equals(location, other.location);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t level = ColumnType::level::default_flags();
    static constexpr uint32_t tag = ColumnType::tag::default_flags();
    static constexpr uint32_t message = ColumnType::message::default_flags();
    static constexpr uint32_t stacktrace = ColumnType::stacktrace::default_flags();
    static constexpr uint32_t location = ColumnType::location::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ProtoLogTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ProtoLogTable, RowNumber> {
   public:
    ConstRowReference(const ProtoLogTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::level::type level() const {
      return table()->level()[row_number_];
    }
    ColumnType::tag::type tag() const {
      return table()->tag()[row_number_];
    }
    ColumnType::message::type message() const {
      return table()->message()[row_number_];
    }
    ColumnType::stacktrace::type stacktrace() const {
      return table()->stacktrace()[row_number_];
    }
    ColumnType::location::type location() const {
      return table()->location()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ProtoLogTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_level(
        ColumnType::level::non_optional_type v) {
      return mutable_table()->mutable_level()->Set(row_number_, v);
    }
    void set_tag(
        ColumnType::tag::non_optional_type v) {
      return mutable_table()->mutable_tag()->Set(row_number_, v);
    }
    void set_message(
        ColumnType::message::non_optional_type v) {
      return mutable_table()->mutable_message()->Set(row_number_, v);
    }
    void set_stacktrace(
        ColumnType::stacktrace::non_optional_type v) {
      return mutable_table()->mutable_stacktrace()->Set(row_number_, v);
    }
    void set_location(
        ColumnType::location::non_optional_type v) {
      return mutable_table()->mutable_location()->Set(row_number_, v);
    }

   private:
    ProtoLogTable* mutable_table() const {
      return const_cast<ProtoLogTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ProtoLogTable, RowNumber, ConstRowReference> {
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
    ColumnType::level::type level() const {
      const auto& col = table()->level();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::tag::type tag() const {
      const auto& col = table()->tag();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::message::type message() const {
      const auto& col = table()->message();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::stacktrace::type stacktrace() const {
      const auto& col = table()->stacktrace();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::location::type location() const {
      const auto& col = table()->location();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ProtoLogTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ProtoLogTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ProtoLogTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ProtoLogTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ProtoLogTable;

     explicit Iterator(ProtoLogTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ProtoLogTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "level", &self->level_, ColumnFlag::level,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "tag", &self->tag_, ColumnFlag::tag,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "message", &self->message_, ColumnFlag::message,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "stacktrace", &self->stacktrace_, ColumnFlag::stacktrace,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "location", &self->location_, ColumnFlag::location,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ProtoLogTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        level_(ColumnStorage<ColumnType::level::stored_type>::Create<false>()),
        tag_(ColumnStorage<ColumnType::tag::stored_type>::Create<false>()),
        message_(ColumnStorage<ColumnType::message::stored_type>::Create<false>()),
        stacktrace_(ColumnStorage<ColumnType::stacktrace::stored_type>::Create<false>()),
        location_(ColumnStorage<ColumnType::location::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        level_storage_layer_(
          new column::StringStorage(string_pool(), &level_.vector())),
        tag_storage_layer_(
          new column::StringStorage(string_pool(), &tag_.vector())),
        message_storage_layer_(
          new column::StringStorage(string_pool(), &message_.vector())),
        stacktrace_storage_layer_(
          new column::StringStorage(string_pool(), &stacktrace_.vector())),
        location_storage_layer_(
          new column::StringStorage(string_pool(), &location_.vector()))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::level::stored_type>(
          ColumnFlag::level),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::tag::stored_type>(
          ColumnFlag::tag),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::message::stored_type>(
          ColumnFlag::message),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::stacktrace::stored_type>(
          ColumnFlag::stacktrace),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::location::stored_type>(
          ColumnFlag::location),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,level_storage_layer_,tag_storage_layer_,message_storage_layer_,stacktrace_storage_layer_,location_storage_layer_},
      {{},{},{},{},{},{},{}});
  }
  ~ProtoLogTable() override;

  static const char* Name() { return "protolog"; }

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
        "level", ColumnType::level::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "tag", ColumnType::tag::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "message", ColumnType::message::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "stacktrace", ColumnType::stacktrace::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "location", ColumnType::location::SqlValueType(), false,
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
    level_.ShrinkToFit();
    tag_.ShrinkToFit();
    message_.ShrinkToFit();
    stacktrace_.ShrinkToFit();
    location_.ShrinkToFit();
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
    mutable_level()->Append(row.level);
    mutable_tag()->Append(row.tag);
    mutable_message()->Append(row.message);
    mutable_stacktrace()->Append(row.stacktrace);
    mutable_location()->Append(row.location);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<ProtoLogTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<StringPool::Id>& level() const {
    return static_cast<const ColumnType::level&>(columns()[ColumnIndex::level]);
  }
  const TypedColumn<StringPool::Id>& tag() const {
    return static_cast<const ColumnType::tag&>(columns()[ColumnIndex::tag]);
  }
  const TypedColumn<StringPool::Id>& message() const {
    return static_cast<const ColumnType::message&>(columns()[ColumnIndex::message]);
  }
  const TypedColumn<StringPool::Id>& stacktrace() const {
    return static_cast<const ColumnType::stacktrace&>(columns()[ColumnIndex::stacktrace]);
  }
  const TypedColumn<StringPool::Id>& location() const {
    return static_cast<const ColumnType::location&>(columns()[ColumnIndex::location]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<StringPool::Id>* mutable_level() {
    return static_cast<ColumnType::level*>(
        GetColumn(ColumnIndex::level));
  }
  TypedColumn<StringPool::Id>* mutable_tag() {
    return static_cast<ColumnType::tag*>(
        GetColumn(ColumnIndex::tag));
  }
  TypedColumn<StringPool::Id>* mutable_message() {
    return static_cast<ColumnType::message*>(
        GetColumn(ColumnIndex::message));
  }
  TypedColumn<StringPool::Id>* mutable_stacktrace() {
    return static_cast<ColumnType::stacktrace*>(
        GetColumn(ColumnIndex::stacktrace));
  }
  TypedColumn<StringPool::Id>* mutable_location() {
    return static_cast<ColumnType::location*>(
        GetColumn(ColumnIndex::location));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::level::stored_type> level_;
  ColumnStorage<ColumnType::tag::stored_type> tag_;
  ColumnStorage<ColumnType::message::stored_type> message_;
  ColumnStorage<ColumnType::stacktrace::stored_type> stacktrace_;
  ColumnStorage<ColumnType::location::stored_type> location_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> level_storage_layer_;
  RefPtr<column::StorageLayer> tag_storage_layer_;
  RefPtr<column::StorageLayer> message_storage_layer_;
  RefPtr<column::StorageLayer> stacktrace_storage_layer_;
  RefPtr<column::StorageLayer> location_storage_layer_;

  
};
  

class InputMethodClientsTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<InputMethodClientsTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const InputMethodClientsTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      InputMethodClientsTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    InputMethodClientsTable, RowNumber> {
   public:
    ConstRowReference(const InputMethodClientsTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const InputMethodClientsTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    InputMethodClientsTable* mutable_table() const {
      return const_cast<InputMethodClientsTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, InputMethodClientsTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const InputMethodClientsTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class InputMethodClientsTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, InputMethodClientsTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<InputMethodClientsTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class InputMethodClientsTable;

     explicit Iterator(InputMethodClientsTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      InputMethodClientsTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit InputMethodClientsTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~InputMethodClientsTable() override;

  static const char* Name() { return "__intrinsic_inputmethod_clients"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<InputMethodClientsTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class InputMethodManagerServiceTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<InputMethodManagerServiceTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const InputMethodManagerServiceTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      InputMethodManagerServiceTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    InputMethodManagerServiceTable, RowNumber> {
   public:
    ConstRowReference(const InputMethodManagerServiceTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const InputMethodManagerServiceTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    InputMethodManagerServiceTable* mutable_table() const {
      return const_cast<InputMethodManagerServiceTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, InputMethodManagerServiceTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const InputMethodManagerServiceTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class InputMethodManagerServiceTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, InputMethodManagerServiceTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<InputMethodManagerServiceTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class InputMethodManagerServiceTable;

     explicit Iterator(InputMethodManagerServiceTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      InputMethodManagerServiceTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit InputMethodManagerServiceTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~InputMethodManagerServiceTable() override;

  static const char* Name() { return "__intrinsic_inputmethod_manager_service"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<InputMethodManagerServiceTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class InputMethodServiceTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<InputMethodServiceTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const InputMethodServiceTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      InputMethodServiceTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    InputMethodServiceTable, RowNumber> {
   public:
    ConstRowReference(const InputMethodServiceTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const InputMethodServiceTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    InputMethodServiceTable* mutable_table() const {
      return const_cast<InputMethodServiceTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, InputMethodServiceTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const InputMethodServiceTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class InputMethodServiceTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, InputMethodServiceTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<InputMethodServiceTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class InputMethodServiceTable;

     explicit Iterator(InputMethodServiceTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      InputMethodServiceTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit InputMethodServiceTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~InputMethodServiceTable() override;

  static const char* Name() { return "__intrinsic_inputmethod_service"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<InputMethodServiceTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class SurfaceFlingerLayersSnapshotTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<SurfaceFlingerLayersSnapshotTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const SurfaceFlingerLayersSnapshotTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      SurfaceFlingerLayersSnapshotTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    SurfaceFlingerLayersSnapshotTable, RowNumber> {
   public:
    ConstRowReference(const SurfaceFlingerLayersSnapshotTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const SurfaceFlingerLayersSnapshotTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    SurfaceFlingerLayersSnapshotTable* mutable_table() const {
      return const_cast<SurfaceFlingerLayersSnapshotTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, SurfaceFlingerLayersSnapshotTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const SurfaceFlingerLayersSnapshotTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class SurfaceFlingerLayersSnapshotTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, SurfaceFlingerLayersSnapshotTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<SurfaceFlingerLayersSnapshotTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class SurfaceFlingerLayersSnapshotTable;

     explicit Iterator(SurfaceFlingerLayersSnapshotTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      SurfaceFlingerLayersSnapshotTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit SurfaceFlingerLayersSnapshotTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~SurfaceFlingerLayersSnapshotTable() override;

  static const char* Name() { return "surfaceflinger_layers_snapshot"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<SurfaceFlingerLayersSnapshotTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class SurfaceFlingerLayerTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t snapshot_id = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<SurfaceFlingerLayerTable::Id>;
    using snapshot_id = TypedColumn<SurfaceFlingerLayersSnapshotTable::Id>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(SurfaceFlingerLayersSnapshotTable::Id in_snapshot_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          snapshot_id(in_snapshot_id),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    SurfaceFlingerLayersSnapshotTable::Id snapshot_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const SurfaceFlingerLayerTable::Row& other) const {
      return ColumnType::snapshot_id::Equals(snapshot_id, other.snapshot_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t snapshot_id = ColumnType::snapshot_id::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      SurfaceFlingerLayerTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    SurfaceFlingerLayerTable, RowNumber> {
   public:
    ConstRowReference(const SurfaceFlingerLayerTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::snapshot_id::type snapshot_id() const {
      return table()->snapshot_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const SurfaceFlingerLayerTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_snapshot_id(
        ColumnType::snapshot_id::non_optional_type v) {
      return mutable_table()->mutable_snapshot_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    SurfaceFlingerLayerTable* mutable_table() const {
      return const_cast<SurfaceFlingerLayerTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, SurfaceFlingerLayerTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::snapshot_id::type snapshot_id() const {
      const auto& col = table()->snapshot_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const SurfaceFlingerLayerTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class SurfaceFlingerLayerTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, SurfaceFlingerLayerTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<SurfaceFlingerLayerTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class SurfaceFlingerLayerTable;

     explicit Iterator(SurfaceFlingerLayerTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      SurfaceFlingerLayerTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "snapshot_id", &self->snapshot_id_, ColumnFlag::snapshot_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit SurfaceFlingerLayerTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        snapshot_id_(ColumnStorage<ColumnType::snapshot_id::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        snapshot_id_storage_layer_(
        new column::NumericStorage<ColumnType::snapshot_id::non_optional_stored_type>(
          &snapshot_id_.vector(),
          ColumnTypeHelper<ColumnType::snapshot_id::stored_type>::ToColumnType(),
          false)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::snapshot_id::stored_type>(
          ColumnFlag::snapshot_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,snapshot_id_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~SurfaceFlingerLayerTable() override;

  static const char* Name() { return "surfaceflinger_layer"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "snapshot_id", ColumnType::snapshot_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    snapshot_id_.ShrinkToFit();
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_snapshot_id()->Append(row.snapshot_id);
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<SurfaceFlingerLayerTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<SurfaceFlingerLayersSnapshotTable::Id>& snapshot_id() const {
    return static_cast<const ColumnType::snapshot_id&>(columns()[ColumnIndex::snapshot_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<SurfaceFlingerLayersSnapshotTable::Id>* mutable_snapshot_id() {
    return static_cast<ColumnType::snapshot_id*>(
        GetColumn(ColumnIndex::snapshot_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::snapshot_id::stored_type> snapshot_id_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> snapshot_id_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class SurfaceFlingerTransactionsTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<SurfaceFlingerTransactionsTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const SurfaceFlingerTransactionsTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      SurfaceFlingerTransactionsTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    SurfaceFlingerTransactionsTable, RowNumber> {
   public:
    ConstRowReference(const SurfaceFlingerTransactionsTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const SurfaceFlingerTransactionsTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    SurfaceFlingerTransactionsTable* mutable_table() const {
      return const_cast<SurfaceFlingerTransactionsTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, SurfaceFlingerTransactionsTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const SurfaceFlingerTransactionsTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class SurfaceFlingerTransactionsTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, SurfaceFlingerTransactionsTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<SurfaceFlingerTransactionsTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class SurfaceFlingerTransactionsTable;

     explicit Iterator(SurfaceFlingerTransactionsTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      SurfaceFlingerTransactionsTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit SurfaceFlingerTransactionsTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~SurfaceFlingerTransactionsTable() override;

  static const char* Name() { return "surfaceflinger_transactions"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<SurfaceFlingerTransactionsTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class ViewCaptureTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<ViewCaptureTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const ViewCaptureTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ViewCaptureTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ViewCaptureTable, RowNumber> {
   public:
    ConstRowReference(const ViewCaptureTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ViewCaptureTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    ViewCaptureTable* mutable_table() const {
      return const_cast<ViewCaptureTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ViewCaptureTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ViewCaptureTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ViewCaptureTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ViewCaptureTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ViewCaptureTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ViewCaptureTable;

     explicit Iterator(ViewCaptureTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ViewCaptureTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ViewCaptureTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~ViewCaptureTable() override;

  static const char* Name() { return "__intrinsic_viewcapture"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<ViewCaptureTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class ViewCaptureViewTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t snapshot_id = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<ViewCaptureViewTable::Id>;
    using snapshot_id = TypedColumn<ViewCaptureTable::Id>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(ViewCaptureTable::Id in_snapshot_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          snapshot_id(in_snapshot_id),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    ViewCaptureTable::Id snapshot_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const ViewCaptureViewTable::Row& other) const {
      return ColumnType::snapshot_id::Equals(snapshot_id, other.snapshot_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t snapshot_id = ColumnType::snapshot_id::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ViewCaptureViewTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ViewCaptureViewTable, RowNumber> {
   public:
    ConstRowReference(const ViewCaptureViewTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::snapshot_id::type snapshot_id() const {
      return table()->snapshot_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ViewCaptureViewTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_snapshot_id(
        ColumnType::snapshot_id::non_optional_type v) {
      return mutable_table()->mutable_snapshot_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    ViewCaptureViewTable* mutable_table() const {
      return const_cast<ViewCaptureViewTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ViewCaptureViewTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::snapshot_id::type snapshot_id() const {
      const auto& col = table()->snapshot_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ViewCaptureViewTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ViewCaptureViewTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ViewCaptureViewTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ViewCaptureViewTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ViewCaptureViewTable;

     explicit Iterator(ViewCaptureViewTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ViewCaptureViewTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "snapshot_id", &self->snapshot_id_, ColumnFlag::snapshot_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ViewCaptureViewTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        snapshot_id_(ColumnStorage<ColumnType::snapshot_id::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        snapshot_id_storage_layer_(
        new column::NumericStorage<ColumnType::snapshot_id::non_optional_stored_type>(
          &snapshot_id_.vector(),
          ColumnTypeHelper<ColumnType::snapshot_id::stored_type>::ToColumnType(),
          false)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::snapshot_id::stored_type>(
          ColumnFlag::snapshot_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,snapshot_id_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~ViewCaptureViewTable() override;

  static const char* Name() { return "__intrinsic_viewcapture_view"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "snapshot_id", ColumnType::snapshot_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    snapshot_id_.ShrinkToFit();
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_snapshot_id()->Append(row.snapshot_id);
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<ViewCaptureViewTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<ViewCaptureTable::Id>& snapshot_id() const {
    return static_cast<const ColumnType::snapshot_id&>(columns()[ColumnIndex::snapshot_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<ViewCaptureTable::Id>* mutable_snapshot_id() {
    return static_cast<ColumnType::snapshot_id*>(
        GetColumn(ColumnIndex::snapshot_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::snapshot_id::stored_type> snapshot_id_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> snapshot_id_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class ViewCaptureInternedDataTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 5;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t base64_proto_id = 1;
    static constexpr uint32_t flat_key = 2;
    static constexpr uint32_t iid = 3;
    static constexpr uint32_t deinterned_value = 4;
  };
  struct ColumnType {
    using id = IdColumn<ViewCaptureInternedDataTable::Id>;
    using base64_proto_id = TypedColumn<uint32_t>;
    using flat_key = TypedColumn<StringPool::Id>;
    using iid = TypedColumn<int64_t>;
    using deinterned_value = TypedColumn<StringPool::Id>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(uint32_t in_base64_proto_id = {},
        StringPool::Id in_flat_key = {},
        int64_t in_iid = {},
        StringPool::Id in_deinterned_value = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          base64_proto_id(in_base64_proto_id),
          flat_key(in_flat_key),
          iid(in_iid),
          deinterned_value(in_deinterned_value) {}
    uint32_t base64_proto_id;
    StringPool::Id flat_key;
    int64_t iid;
    StringPool::Id deinterned_value;

    bool operator==(const ViewCaptureInternedDataTable::Row& other) const {
      return ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id) &&
       ColumnType::flat_key::Equals(flat_key, other.flat_key) &&
       ColumnType::iid::Equals(iid, other.iid) &&
       ColumnType::deinterned_value::Equals(deinterned_value, other.deinterned_value);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
    static constexpr uint32_t flat_key = ColumnType::flat_key::default_flags();
    static constexpr uint32_t iid = ColumnType::iid::default_flags();
    static constexpr uint32_t deinterned_value = ColumnType::deinterned_value::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      ViewCaptureInternedDataTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    ViewCaptureInternedDataTable, RowNumber> {
   public:
    ConstRowReference(const ViewCaptureInternedDataTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
    ColumnType::flat_key::type flat_key() const {
      return table()->flat_key()[row_number_];
    }
    ColumnType::iid::type iid() const {
      return table()->iid()[row_number_];
    }
    ColumnType::deinterned_value::type deinterned_value() const {
      return table()->deinterned_value()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const ViewCaptureInternedDataTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }
    void set_flat_key(
        ColumnType::flat_key::non_optional_type v) {
      return mutable_table()->mutable_flat_key()->Set(row_number_, v);
    }
    void set_iid(
        ColumnType::iid::non_optional_type v) {
      return mutable_table()->mutable_iid()->Set(row_number_, v);
    }
    void set_deinterned_value(
        ColumnType::deinterned_value::non_optional_type v) {
      return mutable_table()->mutable_deinterned_value()->Set(row_number_, v);
    }

   private:
    ViewCaptureInternedDataTable* mutable_table() const {
      return const_cast<ViewCaptureInternedDataTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, ViewCaptureInternedDataTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::flat_key::type flat_key() const {
      const auto& col = table()->flat_key();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::iid::type iid() const {
      const auto& col = table()->iid();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::deinterned_value::type deinterned_value() const {
      const auto& col = table()->deinterned_value();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const ViewCaptureInternedDataTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class ViewCaptureInternedDataTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, ViewCaptureInternedDataTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<ViewCaptureInternedDataTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class ViewCaptureInternedDataTable;

     explicit Iterator(ViewCaptureInternedDataTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      ViewCaptureInternedDataTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "flat_key", &self->flat_key_, ColumnFlag::flat_key,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "iid", &self->iid_, ColumnFlag::iid,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "deinterned_value", &self->deinterned_value_, ColumnFlag::deinterned_value,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit ViewCaptureInternedDataTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>()),
        flat_key_(ColumnStorage<ColumnType::flat_key::stored_type>::Create<false>()),
        iid_(ColumnStorage<ColumnType::iid::stored_type>::Create<false>()),
        deinterned_value_(ColumnStorage<ColumnType::deinterned_value::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        base64_proto_id_storage_layer_(
        new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
          &base64_proto_id_.vector(),
          ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
          false)),
        flat_key_storage_layer_(
          new column::StringStorage(string_pool(), &flat_key_.vector())),
        iid_storage_layer_(
        new column::NumericStorage<ColumnType::iid::non_optional_stored_type>(
          &iid_.vector(),
          ColumnTypeHelper<ColumnType::iid::stored_type>::ToColumnType(),
          false)),
        deinterned_value_storage_layer_(
          new column::StringStorage(string_pool(), &deinterned_value_.vector()))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::flat_key::stored_type>(
          ColumnFlag::flat_key),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::iid::stored_type>(
          ColumnFlag::iid),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::deinterned_value::stored_type>(
          ColumnFlag::deinterned_value),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,base64_proto_id_storage_layer_,flat_key_storage_layer_,iid_storage_layer_,deinterned_value_storage_layer_},
      {{},{},{},{},{}});
  }
  ~ViewCaptureInternedDataTable() override;

  static const char* Name() { return "__intrinsic_viewcapture_interned_data"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "flat_key", ColumnType::flat_key::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "iid", ColumnType::iid::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "deinterned_value", ColumnType::deinterned_value::SqlValueType(), false,
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
    base64_proto_id_.ShrinkToFit();
    flat_key_.ShrinkToFit();
    iid_.ShrinkToFit();
    deinterned_value_.ShrinkToFit();
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
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    mutable_flat_key()->Append(row.flat_key);
    mutable_iid()->Append(row.iid);
    mutable_deinterned_value()->Append(row.deinterned_value);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<ViewCaptureInternedDataTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<uint32_t>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }
  const TypedColumn<StringPool::Id>& flat_key() const {
    return static_cast<const ColumnType::flat_key&>(columns()[ColumnIndex::flat_key]);
  }
  const TypedColumn<int64_t>& iid() const {
    return static_cast<const ColumnType::iid&>(columns()[ColumnIndex::iid]);
  }
  const TypedColumn<StringPool::Id>& deinterned_value() const {
    return static_cast<const ColumnType::deinterned_value&>(columns()[ColumnIndex::deinterned_value]);
  }

  TypedColumn<uint32_t>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }
  TypedColumn<StringPool::Id>* mutable_flat_key() {
    return static_cast<ColumnType::flat_key*>(
        GetColumn(ColumnIndex::flat_key));
  }
  TypedColumn<int64_t>* mutable_iid() {
    return static_cast<ColumnType::iid*>(
        GetColumn(ColumnIndex::iid));
  }
  TypedColumn<StringPool::Id>* mutable_deinterned_value() {
    return static_cast<ColumnType::deinterned_value*>(
        GetColumn(ColumnIndex::deinterned_value));
  }

 private:
  
  
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;
  ColumnStorage<ColumnType::flat_key::stored_type> flat_key_;
  ColumnStorage<ColumnType::iid::stored_type> iid_;
  ColumnStorage<ColumnType::deinterned_value::stored_type> deinterned_value_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;
  RefPtr<column::StorageLayer> flat_key_storage_layer_;
  RefPtr<column::StorageLayer> iid_storage_layer_;
  RefPtr<column::StorageLayer> deinterned_value_storage_layer_;

  
};
  

class WindowManagerShellTransitionsTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t transition_id = 2;
    static constexpr uint32_t arg_set_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<WindowManagerShellTransitionsTable::Id>;
    using ts = TypedColumn<int64_t>;
    using transition_id = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        int64_t in_transition_id = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          transition_id(in_transition_id),
          arg_set_id(in_arg_set_id) {}
    int64_t ts;
    int64_t transition_id;
    std::optional<uint32_t> arg_set_id;

    bool operator==(const WindowManagerShellTransitionsTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::transition_id::Equals(transition_id, other.transition_id) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = ColumnType::ts::default_flags();
    static constexpr uint32_t transition_id = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::transition_id::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      WindowManagerShellTransitionsTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    WindowManagerShellTransitionsTable, RowNumber> {
   public:
    ConstRowReference(const WindowManagerShellTransitionsTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::transition_id::type transition_id() const {
      return table()->transition_id()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const WindowManagerShellTransitionsTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_transition_id(
        ColumnType::transition_id::non_optional_type v) {
      return mutable_table()->mutable_transition_id()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }

   private:
    WindowManagerShellTransitionsTable* mutable_table() const {
      return const_cast<WindowManagerShellTransitionsTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, WindowManagerShellTransitionsTable, RowNumber, ConstRowReference> {
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
    ColumnType::transition_id::type transition_id() const {
      const auto& col = table()->transition_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const WindowManagerShellTransitionsTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class WindowManagerShellTransitionsTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, WindowManagerShellTransitionsTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<WindowManagerShellTransitionsTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class WindowManagerShellTransitionsTable;

     explicit Iterator(WindowManagerShellTransitionsTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      WindowManagerShellTransitionsTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "transition_id", &self->transition_id_, ColumnFlag::transition_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit WindowManagerShellTransitionsTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        transition_id_(ColumnStorage<ColumnType::transition_id::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          false)),
        transition_id_storage_layer_(
        new column::NumericStorage<ColumnType::transition_id::non_optional_stored_type>(
          &transition_id_.vector(),
          ColumnTypeHelper<ColumnType::transition_id::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::transition_id::stored_type>(
          ColumnFlag::transition_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,transition_id_storage_layer_,arg_set_id_storage_layer_},
      {{},{},{},arg_set_id_null_layer_});
  }
  ~WindowManagerShellTransitionsTable() override;

  static const char* Name() { return "window_manager_shell_transitions"; }

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
        "transition_id", ColumnType::transition_id::SqlValueType(), false,
        true,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
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
    transition_id_.ShrinkToFit();
    arg_set_id_.ShrinkToFit();
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
    mutable_transition_id()->Append(row.transition_id);
    mutable_arg_set_id()->Append(row.arg_set_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<WindowManagerShellTransitionsTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<int64_t>& transition_id() const {
    return static_cast<const ColumnType::transition_id&>(columns()[ColumnIndex::transition_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<int64_t>* mutable_transition_id() {
    return static_cast<ColumnType::transition_id*>(
        GetColumn(ColumnIndex::transition_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::transition_id::stored_type> transition_id_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> transition_id_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
};
  

class WindowManagerShellTransitionHandlersTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t handler_id = 1;
    static constexpr uint32_t handler_name = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<WindowManagerShellTransitionHandlersTable::Id>;
    using handler_id = TypedColumn<int64_t>;
    using handler_name = TypedColumn<StringPool::Id>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_handler_id = {},
        StringPool::Id in_handler_name = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          handler_id(in_handler_id),
          handler_name(in_handler_name),
          base64_proto_id(in_base64_proto_id) {}
    int64_t handler_id;
    StringPool::Id handler_name;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const WindowManagerShellTransitionHandlersTable::Row& other) const {
      return ColumnType::handler_id::Equals(handler_id, other.handler_id) &&
       ColumnType::handler_name::Equals(handler_name, other.handler_name) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t handler_id = ColumnType::handler_id::default_flags();
    static constexpr uint32_t handler_name = ColumnType::handler_name::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      WindowManagerShellTransitionHandlersTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    WindowManagerShellTransitionHandlersTable, RowNumber> {
   public:
    ConstRowReference(const WindowManagerShellTransitionHandlersTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::handler_id::type handler_id() const {
      return table()->handler_id()[row_number_];
    }
    ColumnType::handler_name::type handler_name() const {
      return table()->handler_name()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const WindowManagerShellTransitionHandlersTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_handler_id(
        ColumnType::handler_id::non_optional_type v) {
      return mutable_table()->mutable_handler_id()->Set(row_number_, v);
    }
    void set_handler_name(
        ColumnType::handler_name::non_optional_type v) {
      return mutable_table()->mutable_handler_name()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    WindowManagerShellTransitionHandlersTable* mutable_table() const {
      return const_cast<WindowManagerShellTransitionHandlersTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, WindowManagerShellTransitionHandlersTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::handler_id::type handler_id() const {
      const auto& col = table()->handler_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::handler_name::type handler_name() const {
      const auto& col = table()->handler_name();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const WindowManagerShellTransitionHandlersTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class WindowManagerShellTransitionHandlersTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, WindowManagerShellTransitionHandlersTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<WindowManagerShellTransitionHandlersTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class WindowManagerShellTransitionHandlersTable;

     explicit Iterator(WindowManagerShellTransitionHandlersTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      WindowManagerShellTransitionHandlersTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "handler_id", &self->handler_id_, ColumnFlag::handler_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "handler_name", &self->handler_name_, ColumnFlag::handler_name,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit WindowManagerShellTransitionHandlersTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        handler_id_(ColumnStorage<ColumnType::handler_id::stored_type>::Create<false>()),
        handler_name_(ColumnStorage<ColumnType::handler_name::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        handler_id_storage_layer_(
        new column::NumericStorage<ColumnType::handler_id::non_optional_stored_type>(
          &handler_id_.vector(),
          ColumnTypeHelper<ColumnType::handler_id::stored_type>::ToColumnType(),
          false)),
        handler_name_storage_layer_(
          new column::StringStorage(string_pool(), &handler_name_.vector())),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::handler_id::stored_type>(
          ColumnFlag::handler_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::handler_name::stored_type>(
          ColumnFlag::handler_name),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,handler_id_storage_layer_,handler_name_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},{},base64_proto_id_null_layer_});
  }
  ~WindowManagerShellTransitionHandlersTable() override;

  static const char* Name() { return "window_manager_shell_transition_handlers"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "handler_id", ColumnType::handler_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "handler_name", ColumnType::handler_name::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    handler_id_.ShrinkToFit();
    handler_name_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_handler_id()->Append(row.handler_id);
    mutable_handler_name()->Append(row.handler_name);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<WindowManagerShellTransitionHandlersTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& handler_id() const {
    return static_cast<const ColumnType::handler_id&>(columns()[ColumnIndex::handler_id]);
  }
  const TypedColumn<StringPool::Id>& handler_name() const {
    return static_cast<const ColumnType::handler_name&>(columns()[ColumnIndex::handler_name]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_handler_id() {
    return static_cast<ColumnType::handler_id*>(
        GetColumn(ColumnIndex::handler_id));
  }
  TypedColumn<StringPool::Id>* mutable_handler_name() {
    return static_cast<ColumnType::handler_name*>(
        GetColumn(ColumnIndex::handler_name));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::handler_id::stored_type> handler_id_;
  ColumnStorage<ColumnType::handler_name::stored_type> handler_name_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> handler_id_storage_layer_;
  RefPtr<column::StorageLayer> handler_name_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};
  

class WindowManagerShellTransitionProtosTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 3;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t transition_id = 1;
    static constexpr uint32_t base64_proto_id = 2;
  };
  struct ColumnType {
    using id = IdColumn<WindowManagerShellTransitionProtosTable::Id>;
    using transition_id = TypedColumn<int64_t>;
    using base64_proto_id = TypedColumn<uint32_t>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_transition_id = {},
        uint32_t in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          transition_id(in_transition_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t transition_id;
    uint32_t base64_proto_id;

    bool operator==(const WindowManagerShellTransitionProtosTable::Row& other) const {
      return ColumnType::transition_id::Equals(transition_id, other.transition_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t transition_id = ColumnType::transition_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      WindowManagerShellTransitionProtosTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    WindowManagerShellTransitionProtosTable, RowNumber> {
   public:
    ConstRowReference(const WindowManagerShellTransitionProtosTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::transition_id::type transition_id() const {
      return table()->transition_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const WindowManagerShellTransitionProtosTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_transition_id(
        ColumnType::transition_id::non_optional_type v) {
      return mutable_table()->mutable_transition_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    WindowManagerShellTransitionProtosTable* mutable_table() const {
      return const_cast<WindowManagerShellTransitionProtosTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, WindowManagerShellTransitionProtosTable, RowNumber, ConstRowReference> {
   public:
    ColumnType::id::type id() const {
      const auto& col = table()->id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::transition_id::type transition_id() const {
      const auto& col = table()->transition_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const WindowManagerShellTransitionProtosTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class WindowManagerShellTransitionProtosTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, WindowManagerShellTransitionProtosTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<WindowManagerShellTransitionProtosTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class WindowManagerShellTransitionProtosTable;

     explicit Iterator(WindowManagerShellTransitionProtosTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      WindowManagerShellTransitionProtosTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "transition_id", &self->transition_id_, ColumnFlag::transition_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit WindowManagerShellTransitionProtosTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        transition_id_(ColumnStorage<ColumnType::transition_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        transition_id_storage_layer_(
        new column::NumericStorage<ColumnType::transition_id::non_optional_stored_type>(
          &transition_id_.vector(),
          ColumnTypeHelper<ColumnType::transition_id::stored_type>::ToColumnType(),
          false)),
        base64_proto_id_storage_layer_(
        new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
          &base64_proto_id_.vector(),
          ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
          false))
         {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::transition_id::stored_type>(
          ColumnFlag::transition_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,transition_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},{}});
  }
  ~WindowManagerShellTransitionProtosTable() override;

  static const char* Name() { return "__intrinsic_window_manager_shell_transition_protos"; }

  static Table::Schema ComputeStaticSchema() {
    Table::Schema schema;
    schema.columns.emplace_back(Table::Schema::Column{
        "id", SqlValue::Type::kLong, true, true, false, false});
    schema.columns.emplace_back(Table::Schema::Column{
        "transition_id", ColumnType::transition_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    transition_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_transition_id()->Append(row.transition_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<WindowManagerShellTransitionProtosTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& transition_id() const {
    return static_cast<const ColumnType::transition_id&>(columns()[ColumnIndex::transition_id]);
  }
  const TypedColumn<uint32_t>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_transition_id() {
    return static_cast<ColumnType::transition_id*>(
        GetColumn(ColumnIndex::transition_id));
  }
  TypedColumn<uint32_t>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::transition_id::stored_type> transition_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> transition_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  
};
  

class WindowManagerTable : public macros_internal::MacroTable {
 public:
  static constexpr uint32_t kColumnCount = 4;

  struct Id : public BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t v) : BaseId(v) {}
  };
  static_assert(std::is_trivially_destructible_v<Id>,
                "Inheritance used without trivial destruction");
    
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct ColumnType {
    using id = IdColumn<WindowManagerTable::Id>;
    using ts = TypedColumn<int64_t>;
    using arg_set_id = TypedColumn<std::optional<uint32_t>>;
    using base64_proto_id = TypedColumn<std::optional<uint32_t>>;
  };
  struct Row : public macros_internal::RootParentTable::Row {
    Row(int64_t in_ts = {},
        std::optional<uint32_t> in_arg_set_id = {},
        std::optional<uint32_t> in_base64_proto_id = {},
        std::nullptr_t = nullptr)
        : macros_internal::RootParentTable::Row(),
          ts(in_ts),
          arg_set_id(in_arg_set_id),
          base64_proto_id(in_base64_proto_id) {}
    int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;

    bool operator==(const WindowManagerTable::Row& other) const {
      return ColumnType::ts::Equals(ts, other.ts) &&
       ColumnType::arg_set_id::Equals(arg_set_id, other.arg_set_id) &&
       ColumnType::base64_proto_id::Equals(base64_proto_id, other.base64_proto_id);
    }
  };
  struct ColumnFlag {
    static constexpr uint32_t ts = static_cast<uint32_t>(ColumnLegacy::Flag::kSorted) | ColumnType::ts::default_flags();
    static constexpr uint32_t arg_set_id = ColumnType::arg_set_id::default_flags();
    static constexpr uint32_t base64_proto_id = ColumnType::base64_proto_id::default_flags();
  };

  class RowNumber;
  class ConstRowReference;
  class RowReference;

  class RowNumber : public macros_internal::AbstractRowNumber<
      WindowManagerTable, ConstRowReference, RowReference> {
   public:
    explicit RowNumber(uint32_t row_number)
        : AbstractRowNumber(row_number) {}
  };
  static_assert(std::is_trivially_destructible_v<RowNumber>,
                "Inheritance used without trivial destruction");

  class ConstRowReference : public macros_internal::AbstractConstRowReference<
    WindowManagerTable, RowNumber> {
   public:
    ConstRowReference(const WindowManagerTable* table, uint32_t row_number)
        : AbstractConstRowReference(table, row_number) {}

    ColumnType::id::type id() const {
      return table()->id()[row_number_];
    }
    ColumnType::ts::type ts() const {
      return table()->ts()[row_number_];
    }
    ColumnType::arg_set_id::type arg_set_id() const {
      return table()->arg_set_id()[row_number_];
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      return table()->base64_proto_id()[row_number_];
    }
  };
  static_assert(std::is_trivially_destructible_v<ConstRowReference>,
                "Inheritance used without trivial destruction");
  class RowReference : public ConstRowReference {
   public:
    RowReference(const WindowManagerTable* table, uint32_t row_number)
        : ConstRowReference(table, row_number) {}

    void set_ts(
        ColumnType::ts::non_optional_type v) {
      return mutable_table()->mutable_ts()->Set(row_number_, v);
    }
    void set_arg_set_id(
        ColumnType::arg_set_id::non_optional_type v) {
      return mutable_table()->mutable_arg_set_id()->Set(row_number_, v);
    }
    void set_base64_proto_id(
        ColumnType::base64_proto_id::non_optional_type v) {
      return mutable_table()->mutable_base64_proto_id()->Set(row_number_, v);
    }

   private:
    WindowManagerTable* mutable_table() const {
      return const_cast<WindowManagerTable*>(table());
    }
  };
  static_assert(std::is_trivially_destructible_v<RowReference>,
                "Inheritance used without trivial destruction");

  class ConstIterator;
  class ConstIterator : public macros_internal::AbstractConstIterator<
    ConstIterator, WindowManagerTable, RowNumber, ConstRowReference> {
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
    ColumnType::arg_set_id::type arg_set_id() const {
      const auto& col = table()->arg_set_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }
    ColumnType::base64_proto_id::type base64_proto_id() const {
      const auto& col = table()->base64_proto_id();
      return col.GetAtIdx(
        iterator_.StorageIndexForColumn(col.index_in_table()));
    }

   protected:
    explicit ConstIterator(const WindowManagerTable* table,
                           Table::Iterator iterator)
        : AbstractConstIterator(table, std::move(iterator)) {}

    uint32_t CurrentRowNumber() const {
      return iterator_.StorageIndexForLastOverlay();
    }

   private:
    friend class WindowManagerTable;
    friend class macros_internal::AbstractConstIterator<
      ConstIterator, WindowManagerTable, RowNumber, ConstRowReference>;
  };
  class Iterator : public ConstIterator {
    public:
     RowReference row_reference() const {
       return {const_cast<WindowManagerTable*>(table()), CurrentRowNumber()};
     }

    private:
     friend class WindowManagerTable;

     explicit Iterator(WindowManagerTable* table, Table::Iterator iterator)
        : ConstIterator(table, std::move(iterator)) {}
  };

  struct IdAndRow {
    Id id;
    uint32_t row;
    RowReference row_reference;
    RowNumber row_number;
  };

  static std::vector<ColumnLegacy> GetColumns(
      WindowManagerTable* self,
      const macros_internal::MacroTable* parent) {
    std::vector<ColumnLegacy> columns =
        CopyColumnsFromParentOrAddRootColumns(parent);
    uint32_t olay_idx = OverlayCount(parent);
    AddColumnToVector(columns, "ts", &self->ts_, ColumnFlag::ts,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "arg_set_id", &self->arg_set_id_, ColumnFlag::arg_set_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    AddColumnToVector(columns, "base64_proto_id", &self->base64_proto_id_, ColumnFlag::base64_proto_id,
                      static_cast<uint32_t>(columns.size()), olay_idx);
    base::ignore_result(self);
    return columns;
  }

  PERFETTO_NO_INLINE explicit WindowManagerTable(StringPool* pool)
      : macros_internal::MacroTable(
          pool,
          GetColumns(this, nullptr),
          nullptr),
        ts_(ColumnStorage<ColumnType::ts::stored_type>::Create<false>()),
        arg_set_id_(ColumnStorage<ColumnType::arg_set_id::stored_type>::Create<false>()),
        base64_proto_id_(ColumnStorage<ColumnType::base64_proto_id::stored_type>::Create<false>())
,
        id_storage_layer_(new column::IdStorage()),
        ts_storage_layer_(
        new column::NumericStorage<ColumnType::ts::non_optional_stored_type>(
          &ts_.vector(),
          ColumnTypeHelper<ColumnType::ts::stored_type>::ToColumnType(),
          true)),
        arg_set_id_storage_layer_(
          new column::NumericStorage<ColumnType::arg_set_id::non_optional_stored_type>(
            &arg_set_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::arg_set_id::stored_type>::ToColumnType(),
            false)),
        base64_proto_id_storage_layer_(
          new column::NumericStorage<ColumnType::base64_proto_id::non_optional_stored_type>(
            &base64_proto_id_.non_null_vector(),
            ColumnTypeHelper<ColumnType::base64_proto_id::stored_type>::ToColumnType(),
            false))
,
        arg_set_id_null_layer_(new column::NullOverlay(arg_set_id_.bv())),
        base64_proto_id_null_layer_(new column::NullOverlay(base64_proto_id_.bv())) {
    static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::ts::stored_type>(
          ColumnFlag::ts),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::arg_set_id::stored_type>(
          ColumnFlag::arg_set_id),
        "Column type and flag combination is not valid");
      static_assert(
        ColumnLegacy::IsFlagsAndTypeValid<ColumnType::base64_proto_id::stored_type>(
          ColumnFlag::base64_proto_id),
        "Column type and flag combination is not valid");
    OnConstructionCompletedRegularConstructor(
      {id_storage_layer_,ts_storage_layer_,arg_set_id_storage_layer_,base64_proto_id_storage_layer_},
      {{},{},arg_set_id_null_layer_,base64_proto_id_null_layer_});
  }
  ~WindowManagerTable() override;

  static const char* Name() { return "__intrinsic_windowmanager"; }

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
        "arg_set_id", ColumnType::arg_set_id::SqlValueType(), false,
        false,
        false,
        false});
    schema.columns.emplace_back(Table::Schema::Column{
        "base64_proto_id", ColumnType::base64_proto_id::SqlValueType(), false,
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
    arg_set_id_.ShrinkToFit();
    base64_proto_id_.ShrinkToFit();
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
    mutable_arg_set_id()->Append(row.arg_set_id);
    mutable_base64_proto_id()->Append(row.base64_proto_id);
    UpdateSelfOverlayAfterInsert();
    return IdAndRow{id, row_number, RowReference(this, row_number),
                     RowNumber(row_number)};
  }

  

  const IdColumn<WindowManagerTable::Id>& id() const {
    return static_cast<const ColumnType::id&>(columns()[ColumnIndex::id]);
  }
  const TypedColumn<int64_t>& ts() const {
    return static_cast<const ColumnType::ts&>(columns()[ColumnIndex::ts]);
  }
  const TypedColumn<std::optional<uint32_t>>& arg_set_id() const {
    return static_cast<const ColumnType::arg_set_id&>(columns()[ColumnIndex::arg_set_id]);
  }
  const TypedColumn<std::optional<uint32_t>>& base64_proto_id() const {
    return static_cast<const ColumnType::base64_proto_id&>(columns()[ColumnIndex::base64_proto_id]);
  }

  TypedColumn<int64_t>* mutable_ts() {
    return static_cast<ColumnType::ts*>(
        GetColumn(ColumnIndex::ts));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_arg_set_id() {
    return static_cast<ColumnType::arg_set_id*>(
        GetColumn(ColumnIndex::arg_set_id));
  }
  TypedColumn<std::optional<uint32_t>>* mutable_base64_proto_id() {
    return static_cast<ColumnType::base64_proto_id*>(
        GetColumn(ColumnIndex::base64_proto_id));
  }

 private:
  
  
  ColumnStorage<ColumnType::ts::stored_type> ts_;
  ColumnStorage<ColumnType::arg_set_id::stored_type> arg_set_id_;
  ColumnStorage<ColumnType::base64_proto_id::stored_type> base64_proto_id_;

  RefPtr<column::StorageLayer> id_storage_layer_;
  RefPtr<column::StorageLayer> ts_storage_layer_;
  RefPtr<column::StorageLayer> arg_set_id_storage_layer_;
  RefPtr<column::StorageLayer> base64_proto_id_storage_layer_;

  RefPtr<column::OverlayLayer> arg_set_id_null_layer_;
  RefPtr<column::OverlayLayer> base64_proto_id_null_layer_;
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_TABLES_WINSCOPE_TABLES_PY_H_
